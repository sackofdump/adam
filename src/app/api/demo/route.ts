import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const DEMO_EMAIL = "demo@tryadam.com";
const DEMO_PASSWORD = "demo1234";
const DEMO_COMPANY_SLUG = "riverside-hvac-demo";

export async function POST() {
  let company = await prisma.company.findUnique({
    where: { slug: DEMO_COMPANY_SLUG },
  });

  if (!company) {
    company = await prisma.company.create({
      data: { name: "Riverside HVAC & Plumbing", slug: DEMO_COMPANY_SLUG },
    });

    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

    const admin = await prisma.user.create({
      data: {
        name: "Mike Torres",
        email: "mike@riversidehvac.com",
        password: hashedPassword,
        role: "ADMIN",
        companyId: company.id,
      },
    });

    await prisma.user.create({
      data: {
        name: "Demo Viewer",
        email: DEMO_EMAIL,
        password: hashedPassword,
        role: "EMPLOYEE",
        companyId: company.id,
      },
    });

    // Workflows
    await prisma.workflow.create({
      data: {
        title: "Service Call Procedure",
        description: "How we handle a standard residential service call from arrival to payment.",
        authorId: admin.id,
        authorName: admin.name,
        companyId: company.id,
        steps: {
          create: [
            {
              order: 0,
              title: "Arriving at the job site",
              content: "Call the customer when you're 15 minutes out — they expect it and it cuts no-shows in half. Park in the driveway, not on the street. Put on boot covers before entering. Introduce yourself by first name only.\n\nIf it's a repeat customer, check the notes in the job ticket first. Mike usually leaves notes about quirks (dog in backyard, difficult customer, gate code, etc.).",
            },
            {
              order: 1,
              title: "Diagnosing the problem",
              content: "Ask the customer to describe the problem in their words before you touch anything. People notice things we don't and they remember details that matter.\n\nDo a full visual inspection first — don't just go straight to what they described. Half the time there's a secondary issue we would've missed.\n\nIf diagnosis will take more than 20 minutes, tell the customer upfront. Nobody likes surprise time charges.",
            },
            {
              order: 2,
              title: "Quoting the repair",
              content: "NEVER quote a price over the phone without seeing the job first. We lost $800 on a job in 2022 because Mike quoted without knowing the attic access was completely blocked behind drywall.\n\nAlways present the quote in writing — text or email — and get a response back before you start. If they say 'just go ahead verbally,' still send the text. It protects us.\n\nFor anything over $500, offer a payment plan option. We've closed three jobs this year just by mentioning it.",
            },
            {
              order: 3,
              title: "Completing the repair and sign-off",
              content: "Walk the customer through what you did in plain English — no jargon. Show them the before/after if there's anything visual.\n\nGet a signature on the completed work order. If they're not home, take a photo of the completed work and text it to them with a summary.\n\nCollect payment before you leave. We do not invoice residential customers — it always becomes a collections problem. Card reader is on your phone, cash is fine, checks made to Riverside HVAC.",
            },
          ],
        },
      },
    });

    await prisma.workflow.create({
      data: {
        title: "New Equipment Installation",
        description: "Full checklist for installing new HVAC units — residential or light commercial.",
        authorId: admin.id,
        authorName: admin.name,
        companyId: company.id,
        steps: {
          create: [
            {
              order: 0,
              title: "Pre-installation site assessment",
              content: "Visit the site before the installation day if at all possible. Measure the space, confirm electrical panel capacity, check attic/crawl space access, and identify where the line set will run.\n\nTake photos of everything. You will forget details and photos save arguments later.\n\nConfirm the equipment has been ordered and is at the warehouse before you schedule the install date with the customer. Do not assume.",
            },
            {
              order: 1,
              title: "Equipment and materials check",
              content: "Pull the job sheet and verify every item on the materials list before loading the truck. Missing a $4 fitting will cost you a second trip and half a day.\n\nFor Carrier units: double-check the model number matches what was quoted. We have had two incidents where the distributor shipped the wrong unit.\n\nBring extra refrigerant. Always.",
            },
            {
              order: 2,
              title: "Installation",
              content: "Follow manufacturer specs. Do not improvise on clearances — they exist for warranty and safety reasons.\n\nIf you find unexpected conditions (old wiring, corroded lines, structural issues), stop and call Mike before proceeding. Do not work around problems without approval.\n\nFor two-man jobs: the senior tech makes all final connections. Apprentices handle staging, cleanup, and running materials.",
            },
            {
              order: 3,
              title: "System testing and commissioning",
              content: "Run the system for a full 20 minutes minimum before telling the customer it's done. Check all modes: cooling, heating, fan only.\n\nRecord all startup readings on the job sheet: suction pressure, discharge pressure, supply temp, return temp, voltage, amperage. This protects us if there's a warranty claim later.\n\nIf anything reads outside normal range, troubleshoot before leaving — do not leave a system running outside spec.",
            },
            {
              order: 4,
              title: "Customer walkthrough and paperwork",
              content: "Show the customer how to operate the new thermostat. Do not assume they know — even if they've had HVAC their whole life, every system is different.\n\nLeave the warranty registration card filled out. Explain the maintenance schedule and offer to put them on our annual plan.\n\nTake photos of the completed installation for the job file. Mike asks for these within 24 hours.",
            },
          ],
        },
      },
    });

    await prisma.workflow.create({
      data: {
        title: "Annual Maintenance Visit",
        description: "Residential HVAC tune-up — what to check, what to document, what to upsell.",
        authorId: admin.id,
        authorName: admin.name,
        companyId: company.id,
        steps: {
          create: [
            {
              order: 0,
              title: "Pulling the schedule and prep",
              content: "Review the customer history before you go. Note when the unit was installed, what we've worked on before, and any flags Mike left in the file.\n\nFor maintenance customers on our annual plan, they get priority scheduling and the $25 discount automatically — do not make them ask for it.\n\nLoad the truck with filters in the sizes you'll need. Standard sizes are in the shop on the left wall. Unusual sizes need to be ordered.",
            },
            {
              order: 1,
              title: "Indoor unit inspection",
              content: "Check and replace air filter. Photograph the old filter before disposal — customers always want to see how dirty it was.\n\nInspect the evaporator coil, drain pan, and condensate line. A clogged drain line is our number one callback — clear it every time even if it looks fine.\n\nCheck blower motor, belts, and electrical connections. Tighten anything loose.",
            },
            {
              order: 2,
              title: "Outdoor unit inspection",
              content: "Clear debris from around and inside the unit. Check refrigerant levels and log the readings.\n\nClean the condenser coils — use the coil cleaner in the orange bottle, not water alone.\n\nInspect electrical components: capacitors, contactors, disconnect. Capacitors that read below 10% of rated capacity get replaced. We've had three compressor failures this year from bad capacitors that were 'close enough.'",
            },
            {
              order: 3,
              title: "Final check and report",
              content: "Run the system and verify temperatures — supply should be 15-20 degrees cooler than return in cooling mode.\n\nFill out the maintenance report completely. Leave a copy with the customer and upload a photo to the job file.\n\nIf you found anything during the visit that needs attention, quote it before you leave. Strike while the iron is hot — follow-up calls convert at half the rate.",
            },
          ],
        },
      },
    });

    // Knowledge Articles
    await prisma.knowledgeArticle.create({
      data: {
        title: "Supplier & Parts Contacts — Who to Call for What",
        category: "CONTACTS",
        authorId: admin.id,
        authorName: admin.name,
        companyId: company.id,
        content: `ACME HVAC Supply (primary parts supplier)
Counter rep: Dave Kowalski — (555) 014-2233
Dave can get same-day delivery if you call before 11am. Tell him it's for Riverside. He knows us.
Emergency after-hours line: (555) 014-2200 — use only for genuine emergencies, they charge a surcharge.

Carrier Warranty Claims
Account number: RIV-4421
Call Monday through Thursday only. Friday is their short day and claims submitted Friday often get lost until the following week.
Processing takes 3-5 business days. Keep all packaging and photos until the claim is settled.

Ferguson Plumbing Supply (for plumbing jobs)
Our account: #FER-88201
Net-30 terms. DO NOT use the personal credit card for Ferguson orders — always use the account.

Refrigerant (R-410A and R-22)
We get R-410A from Acme. R-22 is getting expensive — Mike approves all R-22 purchases over $200.
Current pricing is on the whiteboard in the shop. Update it when you see it change.

Electrical Supplies
Home Depot on Route 9 for standard supplies.
For specialty items (contactors, capacitors, motors): call Acme first, they usually have it cheaper.`,
      },
    });

    await prisma.knowledgeArticle.create({
      data: {
        title: "Things That Have Cost Us Money — Don't Repeat These",
        category: "WARNING",
        authorId: admin.id,
        authorName: admin.name,
        companyId: company.id,
        content: `Never quote a job without seeing it in person first.
We lost $800 on a job in 2022. Mike quoted an attic installation over the phone. When the crew arrived, the attic access was sealed behind new drywall. Took three extra hours to resolve. Customer refused to pay more than the quote.

The customer at 47 Maple Ave (Henderson account) negotiates after the work is done.
Get the signed quote BEFORE you start work, no exceptions. This applies to every job, but especially here.

Do not leave a system running if refrigerant readings are outside spec.
We had a compressor failure six weeks after a maintenance visit in 2021. The tech noted "slightly low" on the report but left it running. The warranty claim was denied because of the documentation. Always fix it or flag it clearly in writing.

Carrier warranty registration must be submitted within 30 days of installation.
We lost a warranty claim on a $3,200 compressor because the registration was filed on day 34. Set a phone reminder on installation day.

Do not order from Ferguson on a personal card and expect reimbursement.
This has caused accounting issues twice. Use the company account (FER-88201) or talk to Mike first.

Apartment complex jobs: get PO number from property manager before starting.
City Heights Apartments will not pay without a PO on the invoice. Lost 60 days on collections twice because of this.`,
      },
    });

    await prisma.knowledgeArticle.create({
      data: {
        title: "When to Call Mike vs. Handle It Yourself",
        category: "DECISION",
        authorId: admin.id,
        authorName: admin.name,
        companyId: company.id,
        content: `Handle yourself:
- Any standard repair under $800 that you've done before
- Filter replacements, drain line clears, capacitor swaps, thermostat installs
- Quoting new maintenance plan signups
- Rescheduling a job due to weather

Call Mike first:
- Any job where the quote will exceed what was originally discussed with the customer
- Anything involving electrical panels, gas lines, or structural modifications
- When a customer is upset or threatening to dispute a charge
- A repair that's going to require more than 2 hours beyond the original estimate
- Any job at City Hall, Riverside School District, or Henderson Properties (commercial accounts)
- When you find something wrong that wasn't in the original scope and it's going to add cost

Recommend replacement instead of repair when:
- The unit is over 12 years old and needs a compressor
- Repair cost exceeds 50% of replacement cost — present both options in writing
- The customer has had 3+ service calls in the past 18 months on the same system

When in doubt, call. Mike would rather get a quick call than find out later.`,
      },
    });

    await prisma.knowledgeArticle.create({
      data: {
        title: "After-Hours Emergency Calls — How We Handle Them",
        category: "PROCESS",
        authorId: admin.id,
        authorName: admin.name,
        companyId: company.id,
        content: `After-hours calls come to Mike's cell: (555) 097-4401
This will transfer to whoever is on the on-call rotation once Mike retires. Rotation schedule is on the shop whiteboard.

Before dispatching:
Get the customer's address, the problem description, and confirm they understand the after-hours rate. Emergency rate is time-and-a-half with a 1-hour minimum charge.
Send a text to the customer with the rate before leaving — we need written acknowledgment. This is not optional.

What qualifies as a real emergency:
- No heat when outside temp is below 40°F
- Active water leak from HVAC equipment
- Gas smell (tell them to call the gas company first, then us)
- Complete system failure in a commercial facility with food storage or medical equipment

What does NOT qualify:
- "It's not cooling as well as usual"
- Thermostat display is off (check batteries first)
- Noise that the system has been making "for a while"

For anything that can wait until morning, take the information and schedule them for first call. Offer a 7am slot.

After the call:
Log it in the job system before you go to sleep. Mike reviews emergency call logs every morning.`,
      },
    });

    await prisma.knowledgeArticle.create({
      data: {
        title: "VIP Customers — Handle With Care",
        category: "GENERAL",
        authorId: admin.id,
        authorName: admin.name,
        companyId: company.id,
        content: `The Hendersons — 12 Oak Street
Been customers for 22 years. Mike gave them a permanent 10% discount after he flooded their basement in 2009 (long story). Apply it automatically, no questions. Do not make them ask.

City Hall — Maintenance Contract
Our biggest contract, renews every March. Mike handles the renewal call personally.
Primary contact: Carol Reyes, Facilities Manager — (555) 231-0044
Always respond to City Hall calls within 2 hours. They have our service-level agreement in the contract.

Riverside School District
Seasonal work only — summer and winter breaks. Contact is Tom Briggs in facilities.
Invoices go to: accounts.payable@riversidesd.edu — not to Tom directly.
They are slow payers (45-60 days) but they always pay. Don't escalate without checking with Mike.

Dr. Patel's Office (44 Commerce Dr.)
Medical office, so temperature swings matter more than for a regular commercial building. Treat any service call here as urgent during business hours.
Dr. Patel has Mike's personal cell. He will use it. Just be aware.

Martha Simmons — 88 Birch Lane
Elderly customer, lives alone. Always call before arriving and after leaving so she knows the house is secure. Mike's been her tech since 1998. Treat her like family.`,
      },
    });
  }

  return NextResponse.json({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
}
