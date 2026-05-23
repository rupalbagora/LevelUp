
// wrapperGenerator.js

// ================= FUNCTION VALIDATION =================
export function validateFunction(code, question, language) {
  const { functionName } = question;

  if (language === "javascript")
    return new RegExp(`function\\s+${functionName}\\s*\\(`).test(code);

  if (language === "python")
    return new RegExp(`def\\s+${functionName}\\s*\\(`).test(code);

  if (language === "java")
    return new RegExp(`\\b${functionName}\\s*\\(`).test(code);

  return true;
}

// ================= MAIN WRAPPER =================
export function generateWrapper(code, question, language) {
  if (language === "javascript") return jsWrapper(code, question);
  if (language === "python") return pythonWrapper(code, question);
  if (language === "java") return javaWrapper(code, question);

  throw new Error("Unsupported language");
}

// ───────────────── JS WRAPPER (ROBUST) ─────────────────
function jsWrapper(code, question) {
  const { functionName, parameters } = question;

  return `
${code}

// ── runner (hidden from user) ──
const raw = require("fs").readFileSync(0, "utf-8").trim();
const inputs = raw ? raw.split("\\n") : [];

// 🔥 Safe parser
const safeParse = (val) => {
  try {
    return JSON.parse(val);
  } catch {
    if (!isNaN(val)) return Number(val);
    return val;
  }
};

${parameters
  .map(
    (p, i) =>
      `const ${p} = inputs[${i}] !== undefined ? safeParse(inputs[${i}]) : null;`
  )
  .join("\n")}

try {
  const result = ${functionName}(${parameters.join(", ")});
  console.log(JSON.stringify(result));
} catch (e) {
  process.stderr.write(e.message);
  process.exit(1);
}
`;
}

// ───────────────── PYTHON WRAPPER (ROBUST) ─────────────────
function pythonWrapper(code, question) {
  const { functionName, parameters } = question;

  return `
import sys, json

${code}

# ── runner (hidden from user) ──
raw = sys.stdin.read().strip()
inputs = raw.split("\\n") if raw else []

# 🔥 Safe parser
def safe_parse(val):
    try:
        return json.loads(val)
    except:
        try:
            return int(val)
        except:
            try:
                return float(val)
            except:
                return val

${parameters
  .map(
    (p, i) =>
      `${p} = safe_parse(inputs[${i}]) if len(inputs) > ${i} else None`
  )
  .join("\n")}

try:
    result = ${functionName}(${parameters.join(", ")})
    print(json.dumps(result))
except Exception as e:
    sys.stderr.write(str(e))
    sys.exit(1)
`;
}

// ───────────────── JAVA WRAPPER ─────────────────
function javaWrapper(code, question) {
  const { functionName, parameters } = question;

  const paramTypes = question.paramTypes || parameters.map(() => "int");

  const parseLines = parameters
    .map((p, i) => {
      const t = paramTypes[i] || "int";
      if (t === "int[]")
        return `int[] ${p} = Arrays.stream(lines.get(${i}).replaceAll("[\\[\\]\\s]", "").split(","))
        .mapToInt(Integer::parseInt).toArray();`;

      return `int ${p} = Integer.parseInt(lines.get(${i}).trim());`;
    })
    .join("\n        ");

  return `
import java.util.*;

public class Main {
    // ── user code ──
    ${code.replace(/class Solution\\s*\\{/, "").replace(/\\}\\s*$/, "")}

    // ── runner (hidden from user) ──
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        List<String> lines = new ArrayList<>();
        while (sc.hasNextLine()) lines.add(sc.nextLine());

        ${parseLines}

        Main sol = new Main();
        System.out.println(sol.${functionName}(${parameters.join(", ")}));
    }
}
`;
}