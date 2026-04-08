export function generateStarterCode(question, language) {
   const { functionName = "solution", parameters = [] } = question;
  const lang = language.startsWith("python") ? "python" : language;

  if (lang === "javascript") {
    return generateJSStarter(functionName, parameters);
  }

  if (lang === "python") {
    return generatePythonStarter(functionName, parameters);
  }

  if (lang === "java") {
    return generateJavaStarter(functionName, parameters);
  }

  return "";
}

// ================= JS =================
function generateJSStarter(name, params) {
  return `function ${name}(${params.join(", ")}) {
  // Write your code here
  
}
`;
}

// ================= PYTHON =================
function generatePythonStarter(name, params) {
  return `def ${name}(${params.join(", ")}):
    # Write your code here
    pass
`;
}

// ================= JAVA =================
function generateJavaStarter(name, params) {
  return `class Solution {
    public static int ${name}(${params.map((p) => "int " + p).join(", ")}) {
        // Write your code here
        return 0;
    }
}
`;
}
