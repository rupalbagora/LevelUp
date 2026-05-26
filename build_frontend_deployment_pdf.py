from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    ListFlowable,
    ListItem,
    PageBreak,
    KeepTogether,
)


OUTPUT = "LevelUp_Frontend_Vercel_Deployment_Guide.pdf"


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="GuideTitle",
        parent=styles["Title"],
        fontName="Helvetica",
        fontSize=24,
        leading=30,
        textColor=colors.black,
        alignment=TA_LEFT,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="Subtitle",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10.5,
        leading=15,
        textColor=colors.HexColor("#555555"),
        spaceAfter=18,
    )
)
styles.add(
    ParagraphStyle(
        name="H1Guide",
        parent=styles["Heading1"],
        fontName="Helvetica",
        fontSize=17,
        leading=22,
        textColor=colors.black,
        spaceBefore=18,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="H2Guide",
        parent=styles["Heading2"],
        fontName="Helvetica",
        fontSize=13.5,
        leading=18,
        textColor=colors.black,
        spaceBefore=12,
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        name="BodyGuide",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.black,
        spaceAfter=7,
    )
)
styles.add(
    ParagraphStyle(
        name="CodeGuide",
        parent=styles["Code"],
        fontName="Courier",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#24292F"),
        backColor=colors.HexColor("#F6F8FA"),
        borderColor=colors.HexColor("#DADCE0"),
        borderWidth=0.4,
        borderPadding=7,
        spaceBefore=4,
        spaceAfter=10,
    )
)
styles.add(
    ParagraphStyle(
        name="NoteGuide",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#434343"),
        backColor=colors.HexColor("#F8F9FA"),
        borderColor=colors.HexColor("#DADCE0"),
        borderWidth=0.5,
        borderPadding=7,
        spaceBefore=4,
        spaceAfter=10,
    )
)


def p(text, style="BodyGuide"):
    return Paragraph(text, styles[style])


def h1(text):
    return p(text, "H1Guide")


def h2(text):
    return p(text, "H2Guide")


def bullets(items):
    return ListFlowable(
        [ListItem(p(item), leftIndent=12) for item in items],
        bulletType="bullet",
        start="circle",
        leftIndent=20,
        bulletFontName="Helvetica",
        bulletFontSize=8,
    )


def numbers(items):
    return ListFlowable(
        [ListItem(p(item), leftIndent=14) for item in items],
        bulletType="1",
        leftIndent=22,
        bulletFontName="Helvetica",
        bulletFontSize=9,
    )


def code(lines):
    return p("<br/>".join(line.replace(" ", "&nbsp;") for line in lines), "CodeGuide")


def note(title, body):
    return p(f"<b>{title}:</b> {body}", "NoteGuide")


def table(headers, rows, widths):
    data = [[p(f"<b>{h}</b>") for h in headers]]
    for row in rows:
        data.append([p(cell) for cell in row])

    t = Table(data, colWidths=widths, hAlign="LEFT", repeatRows=1)
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F1F3F4")),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#DADCE0")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return t


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#666666"))
    canvas.drawString(inch, 0.45 * inch, "LevelUp frontend deployment guide")
    canvas.drawRightString(7.5 * inch, 0.45 * inch, f"Page {doc.page}")
    canvas.restoreState()


def build_story():
    story = []
    story.append(p("LevelUp Frontend Deployment on Vercel", "GuideTitle"))
    story.append(
        p(
            "Step-by-step setup for deploying the React/Vite frontend and updating the already-deployed backend.",
            "Subtitle",
        )
    )

    story.append(h1("1. Project Summary"))
    story.append(
        p(
            "Your frontend is a Vite + React app inside the existing MERN project. The backend is already deployed, so Vercel only needs to build and host the client folder. Do not deploy the whole LevelUp repository as the app root; point Vercel to the frontend folder."
        )
    )
    story.append(
        table(
            ["Setting", "Value for this project"],
            [
                ["Vercel root directory", "client/levelUp"],
                ["Framework preset", "Vite"],
                ["Install command", "npm install"],
                ["Build command", "npm run build"],
                ["Output directory", "dist"],
                ["Frontend env key", "VITE_API_URL"],
                ["Google env key", "VITE_GOOGLE_CLIENT_ID"],
            ],
            [2.25 * inch, 4.0 * inch],
        )
    )
    story.append(Spacer(1, 8))

    story.append(h1("2. Before You Deploy"))
    story.append(
        bullets(
            [
                "Confirm the backend deployed URL is working, for example: https://your-backend-domain.com/test.",
                "Confirm backend CORS allows the Vercel frontend domain after deployment.",
                "Make sure your frontend code is pushed to GitHub, GitLab, or Bitbucket.",
                "Keep all secrets out of Git. Add runtime values in Vercel Environment Variables.",
                "If Google sign-in is used, keep the same OAuth client ID in frontend and backend configuration.",
            ]
        )
    )

    story.append(h1("3. Deploy Frontend on Vercel"))
    story.append(
        numbers(
            [
                "Open https://vercel.com and sign in.",
                "Click Add New, then Project.",
                "Import the Git repository that contains the LevelUp project.",
                "When Vercel asks for Root Directory, select client/levelUp.",
                "Set Framework Preset to Vite if Vercel does not auto-detect it.",
                "Keep Install Command as npm install.",
                "Set Build Command to npm run build.",
                "Set Output Directory to dist.",
                "Add all required environment variables before clicking Deploy.",
                "Click Deploy and wait until the build finishes successfully.",
            ]
        )
    )
    story.append(h2("Environment Variables in Vercel"))
    story.append(
        table(
            ["Variable", "Example / Meaning"],
            [
                ["VITE_API_URL", "Your deployed backend base URL, e.g. https://your-backend-domain.com"],
                ["VITE_GOOGLE_CLIENT_ID", "Google OAuth Web Client ID used by @react-oauth/google"],
            ],
            [2.2 * inch, 4.05 * inch],
        )
    )
    story.append(note("Important", "Vite exposes only variables that start with VITE_. Do not use REACT_APP_ for this project."))

    story.append(PageBreak())
    story.append(h1("4. Backend CORS Setup for Vercel"))
    story.append(
        p(
            "After frontend deployment, copy the Vercel production URL, then add it to the backend CORS allowed origins. If the backend currently allows every origin during development, tighten it for production with your exact Vercel domain."
        )
    )
    story.append(
        code(
            [
                "const allowedOrigins = [",
                "  'http://localhost:5173',",
                "  'https://your-vercel-app.vercel.app',",
                "];",
                "",
                "app.use(cors({",
                "  origin: allowedOrigins,",
                "  credentials: true,",
                "}));",
            ]
        )
    )
    story.append(
        p(
            "If you use cookie-based login across different domains, the backend cookie settings also matter. In production, use secure: true and sameSite: 'none' only when your frontend and backend are on different domains and HTTPS is enabled."
        )
    )
    story.append(
        code(
            [
                "res.cookie('token', token, {",
                "  httpOnly: true,",
                "  secure: process.env.NODE_ENV === 'production',",
                "  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',",
                "  path: '/',",
                "});",
            ]
        )
    )

    story.append(h1("5. Google Sign-In Setup"))
    story.append(
        numbers(
            [
                "Open Google Cloud Console.",
                "Go to APIs & Services, then Credentials.",
                "Open your OAuth 2.0 Web Client ID.",
                "Add http://localhost:5173 to Authorized JavaScript origins for local testing.",
                "Add your Vercel URL, for example https://your-vercel-app.vercel.app, to Authorized JavaScript origins.",
                "Save the changes.",
                "Use the same client ID in Vercel as VITE_GOOGLE_CLIENT_ID.",
                "Use the same client ID in the backend deployment as GOOGLE_CLIENT_ID.",
            ]
        )
    )

    story.append(h1("6. Test After Deployment"))
    story.append(
        bullets(
            [
                "Open the Vercel URL in a fresh browser session.",
                "Test normal signup with username, email, and password.",
                "Test login and confirm the dashboard opens.",
                "Test forgot password: request token, reset password, then login with the new password.",
                "Test Google sign-in after OAuth origins are updated.",
                "Open Profile and Dashboard pages to confirm authenticated API calls work.",
                "Create a battle link and verify the frontend can communicate with the deployed backend.",
                "Check Vercel build logs only for frontend build issues; backend runtime logs are on the backend host.",
            ]
        )
    )

    story.append(PageBreak())
    story.append(h1("7. Common Errors and Fixes"))
    story.append(
        table(
            ["Problem", "Most likely fix"],
            [
                ["Blank page on Vercel", "Check Root Directory is client/levelUp and Output Directory is dist."],
                ["API calls go to wrong URL", "Set VITE_API_URL in Vercel and redeploy."],
                ["Login works locally but not on Vercel", "Update backend CORS and cookie sameSite/secure settings."],
                ["Google button fails", "Add Vercel URL to Google OAuth Authorized JavaScript origins."],
                ["Environment variable not found", "Use VITE_ prefix and redeploy after adding the variable."],
                ["404 on refresh", "Vercel usually handles Vite SPA routing; add a rewrite to /index.html if needed."],
            ],
            [2.0 * inch, 4.25 * inch],
        )
    )
    story.append(h2("Optional vercel.json for SPA refresh"))
    story.append(p("Create this file inside client/levelUp only if refresh routes like /dashboard or /signin show 404."))
    story.append(
        code(
            [
                "{",
                '  "rewrites": [',
                '    { "source": "/(.*)", "destination": "/index.html" }',
                "  ]",
                "}",
            ]
        )
    )

    story.append(h1("8. How to Add New Backend Features to the Already-Deployed Backend"))
    story.append(
        p(
            "When you add a new backend feature, the deployed backend will not update automatically unless your hosting platform is connected to Git auto-deploy or you manually redeploy it. Follow this workflow."
        )
    )
    story.append(
        numbers(
            [
                "Add the backend code locally: model, controller, route, middleware, or service as needed.",
                "Register the route in server/src/app.js or the correct route file.",
                "Add any new environment variables to the backend hosting platform dashboard.",
                "Run backend tests locally: npm.cmd test from LevelUp/server.",
                "Commit and push the backend changes to the branch used by your backend host.",
                "Open your backend hosting platform and trigger redeploy if auto-deploy is not enabled.",
                "Check deployment logs for install, build, startup, MongoDB, and env errors.",
                "Test the new API endpoint using Postman, Thunder Client, or the frontend.",
                "If the frontend calls this new API, update frontend service files and redeploy Vercel too.",
            ]
        )
    )
    story.append(
        note(
            "Rule",
            "Backend feature added means backend redeploy is required. Frontend redeploy is required only when frontend code or frontend environment variables changed.",
        )
    )

    story.append(h1("9. Final Deployment Checklist"))
    story.append(
        bullets(
            [
                "Frontend root directory on Vercel is client/levelUp.",
                "VITE_API_URL points to deployed backend, not localhost.",
                "VITE_GOOGLE_CLIENT_ID is set in Vercel.",
                "Backend GOOGLE_CLIENT_ID is set on backend host.",
                "Backend CORS includes the Vercel production URL.",
                "Cookie settings are production-ready if using cross-domain cookies.",
                "Signup, login, forgot password, reset password, Google sign-in, dashboard, and profile are tested after deploy.",
            ]
        )
    )
    return story


if __name__ == "__main__":
    doc = SimpleDocTemplate(
        OUTPUT,
        pagesize=LETTER,
        rightMargin=inch,
        leftMargin=inch,
        topMargin=0.85 * inch,
        bottomMargin=0.75 * inch,
        title="LevelUp Frontend Vercel Deployment Guide",
    )
    doc.build(build_story(), onFirstPage=header_footer, onLaterPages=header_footer)
