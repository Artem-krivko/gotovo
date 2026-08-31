from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "output" / "pdf" / "google-ads-api-tool-design.pdf"

INK = colors.HexColor("#171712")
COBALT = colors.HexColor("#2656D8")
SIGNAL = colors.HexColor("#FF6542")
ACID = colors.HexColor("#D8FF52")
PAPER = colors.HexColor("#F2EFE7")
MUTED = colors.HexColor("#66665F")
LINE = colors.HexColor("#D5D1C8")


def page_chrome(canvas, document):
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(INK)
    canvas.rect(0, height - 15 * mm, width, 15 * mm, fill=1, stroke=0)
    canvas.setFillColor(ACID)
    canvas.rect(0, height - 16 * mm, width, 1 * mm, fill=1, stroke=0)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.setFillColor(colors.white)
    canvas.drawString(18 * mm, height - 9.5 * mm, "GOTOVO / GOOGLE ADS API")
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 10 * mm, "Internal API tool design - Basic Access application")
    canvas.drawRightString(width - 18 * mm, 10 * mm, f"{document.page}")
    canvas.restoreState()


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="TitleGotovo",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=27,
        leading=30,
        textColor=INK,
        spaceAfter=8 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="SubtitleGotovo",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=12,
        leading=17,
        textColor=MUTED,
        spaceAfter=7 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="HeadingGotovo",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=18,
        textColor=COBALT,
        spaceBefore=4 * mm,
        spaceAfter=2.5 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="BodyGotovo",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.4,
        leading=13.6,
        textColor=INK,
        spaceAfter=2.5 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="SmallGotovo",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8.2,
        leading=11.5,
        textColor=MUTED,
    )
)
styles.add(
    ParagraphStyle(
        name="CalloutGotovo",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=14,
        textColor=INK,
        borderColor=SIGNAL,
        borderWidth=1,
        borderPadding=9,
        backColor=PAPER,
        spaceBefore=2 * mm,
        spaceAfter=5 * mm,
    )
)


def paragraph(text, style="BodyGotovo"):
    return Paragraph(text, styles[style])


def bullet(text):
    return Paragraph(f"<font color='#2656D8'>-</font> {text}", styles["BodyGotovo"])


def info_table(rows, widths=(47 * mm, 115 * mm)):
    table = Table(
        [[paragraph(left, "SmallGotovo"), paragraph(right, "BodyGotovo")] for left, right in rows],
        colWidths=list(widths),
        hAlign="LEFT",
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), PAPER),
                ("TEXTCOLOR", (0, 0), (0, -1), MUTED),
                ("BOX", (0, 0), (-1, -1), 0.5, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 4.5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4.5),
            ]
        )
    )
    return table


def build_story():
    story = [
        Spacer(1, 8 * mm),
        paragraph("Internal Google Ads API Tool", "TitleGotovo"),
        paragraph(
            "Design and operational controls for managing gotovo's own Google Ads search campaigns",
            "SubtitleGotovo",
        ),
        paragraph(
            "Scope: internal use only. The tool is not offered to clients or the public. It manages advertising for usegotovo.by through the gotovo manager account.",
            "CalloutGotovo",
        ),
        info_table(
            [
                ("Company", "gotovo - web development studio in Belarus"),
                ("Primary website", "https://www.usegotovo.by"),
                ("Manager account", "570-737-3950"),
                ("Advertiser account", "211-905-4297 (usegotovo.by)"),
                ("Cloud project", "gotovo-seo / project number 94361772104"),
                ("API version", "Google Ads REST API v25"),
                ("Audience", "Owner and authorized internal operators only"),
            ]
        ),
        paragraph("1. Business purpose", "HeadingGotovo"),
        paragraph(
            "gotovo designs and develops landing pages and business websites for customers in Belarus. The API tool supports the company's own customer acquisition. It replaces repetitive UI work with reviewed scripts and creates an auditable record of changes.",
        ),
        paragraph("Initial supported activities:"),
        bullet("Read account, campaign, ad group, keyword, search term, conversion and cost statistics."),
        bullet("Generate campaign drafts locally and validate budgets, geography, URLs and tracking parameters."),
        bullet("After explicit owner approval, create or update search campaign entities for usegotovo.by."),
        bullet("Never enable spend automatically and never increase an approved budget ceiling without a new approval."),
        paragraph("2. Users and access model", "HeadingGotovo"),
        paragraph(
            "The tool uses single-user OAuth authorization for a Google account that has access to the gotovo manager account. Credentials are not shared with external users. There is no public login, customer-facing dashboard or multi-tenant data store.",
        ),
        Spacer(1, 4 * mm),
        KeepTogether(
            [
                paragraph("System architecture", "HeadingGotovo"),
                info_table(
                    [
                        ("Operator", "Runs reviewed commands from the private project workspace."),
                        ("Local safety layer", "Validates environment gates, operation allow-lists and target customer IDs."),
                        ("OAuth", "Refresh token is exchanged for a short-lived access token using Google's token endpoint."),
                        ("Google Ads API", "Requests include OAuth, developer-token and login-customer-id headers."),
                        ("Audit output", "Non-secret operation result, reason and affected resource IDs are recorded."),
                    ]
                ),
            ]
        ),
        paragraph("3. Data flow", "HeadingGotovo"),
        bullet("The operator selects a read-only audit or an approved mutation plan."),
        bullet("The tool validates ADS_API_MODE, write permission, spend permission and customer ID."),
        bullet("OAuth credentials produce a one-hour access token; the refresh token remains local."),
        bullet("The tool sends only the minimum Google Ads API request required for the operation."),
        bullet("The response is summarized without exporting personal customer data or credentials."),
        paragraph(
            "Lead contact details are not uploaded to Google Ads during the initial implementation. If offline conversion import is added later, it will require a separate design review, consent assessment and explicit owner approval.",
            "CalloutGotovo",
        ),
        paragraph("4. Security controls", "HeadingGotovo"),
        info_table(
            [
                ("Credential storage", "Local ads/.env.local, excluded from Git, filesystem mode 0600."),
                ("Default mode", "ADS_API_MODE=read_only; account writes=false; spend=false."),
                ("Least privilege", "One OAuth scope: https://www.googleapis.com/auth/adwords."),
                ("Target restriction", "Configured manager and advertiser customer IDs are required."),
                ("Source control", "Secrets, tokens and private exports are ignored and never committed."),
                ("Authentication", "Google account uses 2-step verification / passkey."),
                ("Rotation", "OAuth client secrets and refresh tokens can be rotated or revoked."),
            ]
        ),
        KeepTogether(
            [
                paragraph("5. Write and spend gates", "HeadingGotovo"),
                paragraph(
                    "Read access does not imply permission to change advertising. Mutations and spend are two independent controls. Both remain disabled in the current implementation.",
                ),
                info_table(
                    [
                        ("Gate A - account writes", "Required before add, update or remove operations can run."),
                        ("Gate B - spend", "Required before a campaign can become eligible to serve."),
                        ("Budget ceiling", "First-month planning ceiling is 300 BYN, but it is not launch authorization."),
                        ("Approval evidence", "The owner reviews campaign structure, ads, targets, budget and stop rules."),
                        ("Rollback", "Changes use stored resource IDs and are logged for reversal where supported."),
                    ]
                ),
            ]
        ),
        KeepTogether(
            [
                paragraph("6. API operations", "HeadingGotovo"),
                paragraph("Implemented now:"),
                bullet("customers:listAccessibleCustomers - verifies OAuth and account visibility."),
                bullet("Read-only reporting and Google Ads Query Language SELECT operations will be allow-listed."),
            ]
        ),
        paragraph("Planned after approval:"),
        bullet("CampaignBudgetService, CampaignService, AdGroupService, AdGroupCriterionService and AdGroupAdService mutations."),
        bullet("Campaign status remains paused until the separate spend gate is approved."),
        paragraph("Explicitly excluded from the first phase:"),
        bullet("Automated budget increases, public user access, third-party client accounts and app conversion tracking."),
        bullet("Bulk deletion, unrestricted mutate endpoints and automated campaign activation."),
        PageBreak(),
        paragraph("7. Monitoring and incident response", "HeadingGotovo"),
        bullet("Every API operation records timestamp, platform, operation type, resource IDs, reason and result."),
        bullet("Secrets and lead personal data are never written to the operation log."),
        bullet("Authentication, permission or customer-ID mismatches fail closed."),
        bullet("Unexpected API responses stop the workflow; they do not trigger automatic retries of mutations."),
        bullet("The owner can revoke the Google connection, rotate the secret or disable the developer token."),
        paragraph("8. Compliance and review", "HeadingGotovo"),
        paragraph(
            "The tool is designed to comply with Google Ads API Terms and policies. API access is used only for the company's own advertising. The website, contact email and developer details are maintained in the API Center. The implementation will be reviewed whenever scopes, audiences, stored data or supported mutation services change.",
        ),
        paragraph("Current verification status", "HeadingGotovo"),
        info_table(
            [
                ("Google Ads API", "Enabled in Cloud project gotovo-seo."),
                ("OAuth client", "Desktop client gotovo-ads; refresh token generated."),
                ("Read-only test", "listAccessibleCustomers succeeded for six accessible accounts."),
                ("Developer token", "Test access; this document supports the Basic Access application."),
                ("Campaign changes", "None performed as part of setup."),
            ]
        ),
        Spacer(1, 2 * mm),
        paragraph(
            "Document owner: Artem Krivko / gotovo | Prepared: 31 August 2026 | Contact: krivko219319@gmail.com",
            "SmallGotovo",
        ),
    ]
    return story


def build_pdf():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    document = BaseDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=23 * mm,
        bottomMargin=17 * mm,
        title="gotovo Google Ads API Tool Design",
        author="gotovo",
        subject="Google Ads API Basic Access application documentation",
    )
    frame = Frame(
        document.leftMargin,
        document.bottomMargin,
        document.width,
        document.height,
        id="body",
    )
    document.addPageTemplates([PageTemplate(id="default", frames=[frame], onPage=page_chrome)])
    document.build(build_story())
    print(OUTPUT)


if __name__ == "__main__":
    build_pdf()
