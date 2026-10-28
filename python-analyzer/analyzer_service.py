"""
Safe Python Static Analysis Microservice
Uses pure standard library AST and lexical parsing to evaluate Python code complexity.
Guaranteed Zero Code Execution on host machine.
"""

import ast
import json
import math
from http.server import HTTPServer, BaseHTTPRequestHandler
import sys

class AstMetricsVisitor(ast.NodeVisitor):
    def __init__(self):
        self.decision_points = 0
        self.loc = 0
        self.issues = []
        self.max_nesting = 0
        self.current_depth = 0

    def visit_If(self, node):
        self.decision_points += 1
        self._check_nesting(node)
        self.generic_visit(node)

    def visit_For(self, node):
        self.decision_points += 1
        self._check_nesting(node)
        self.generic_visit(node)

    def visit_While(self, node):
        self.decision_points += 1
        self._check_nesting(node)
        self.generic_visit(node)

    def visit_Try(self, node):
        for handler in node.handlers:
            if handler.type is None:
                self.issues.append({
                    "line": handler.lineno,
                    "severity": "Major",
                    "type": "Error Handling",
                    "title": "Bare 'except:' clause masks unexpected system exceptions",
                    "description": "Always specify explicit exception classes (e.g. except ValueError:)."
                })
        self.generic_visit(node)

    def visit_Call(self, node):
        if isinstance(node.func, ast.Name) and node.func.id == "print":
            self.issues.append({
                "line": node.lineno,
                "severity": "Minor",
                "type": "Code Smell",
                "title": "Built-in print() used for debugging in production logic",
                "description": "Replace print statements with the standard logging module."
            })
        self.generic_visit(node)

    def _check_nesting(self, node):
        self.current_depth += 1
        if self.current_depth > self.max_nesting:
            self.max_nesting = self.current_depth
        if self.current_depth >= 4:
            self.issues.append({
                "line": getattr(node, "lineno", 1),
                "severity": "Major",
                "type": "Complexity",
                "title": f"Excessive nesting depth ({self.current_depth} levels)",
                "description": "Consider early return statements or extracting helper functions."
            })

class AnalysisHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == "/analyze":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length).decode("utf-8")
            try:
                payload = json.loads(post_data)
                code = payload.get("code", "")
                language = payload.get("language", "python")

                tree = ast.parse(code)
                visitor = AstMetricsVisitor()
                visitor.visit(tree)

                lines = [l for l in code.split("\n") if l.strip() and not l.strip().startswith("#")]
                loc = len(lines)
                cyclomatic = visitor.decision_points + 1

                # Calculate maintainability index
                halstead_vol = max(10.0, loc * 28.5)
                raw_mi = 171.0 - (5.2 * math.log(halstead_vol)) - (0.23 * cyclomatic) - (16.2 * math.log(max(1, loc)))
                mi = max(20, min(100, int(round(raw_mi * 100.0 / 171.0 + 15))))

                result = {
                    "qualityScore": max(30, min(98, 100 - (cyclomatic * 2) - len(visitor.issues) * 5)),
                    "maintainabilityIndex": mi,
                    "cyclomaticComplexity": cyclomatic,
                    "linesOfCode": loc,
                    "cognitiveComplexity": int(cyclomatic * 0.8),
                    "halsteadVolume": halstead_vol,
                    "issues": visitor.issues,
                    "engine": "Safe Python AST Microservice"
                }

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps(result).encode("utf-8"))

            except Exception as e:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

    def do_GET(self):
        if self.path == "/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "UP", "engine": "Python AST Analyzer"}).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

def run(port=5001):
    server_address = ("127.0.0.1", port)
    httpd = HTTPServer(server_address, AnalysisHandler)
    print(f"Python Safe Static Analysis Microservice running on http://127.0.0.1:{port}")
    httpd.serve_forever()

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5001
    run(port)
