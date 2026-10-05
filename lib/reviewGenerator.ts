// QRmandu Review Generation Engine
// Generates unique, natural, simple-English reviews based on star rating
// Varies opening, structure, length, vocabulary, rhythm, tone
// Avoids repetitive templates, marketing language, AI vocabulary

type Rating = 1 | 2 | 3 | 4 | 5;

interface BusinessContext {
  name?: string;
  category?: string;
  subcategory?: string;
}

const openings5 = [
  "Really loved my time here",
  "Had a wonderful experience",
  "Such a great place",
  "Absolutely enjoyed visiting",
  "One of the best experiences I've had",
  "Really happy with the service",
  "Great place to visit",
  "Loved everything about it",
  "Fantastic experience overall",
  "Truly impressed",
  "Will definitely come back",
  "Highly recommend this place",
  "Superb in every way",
  "What a lovely place",
  "Made my day",
];

const openings4 = [
  "Had a good experience here",
  "Nice place overall",
  "Enjoyed my visit",
  "Pretty good experience",
  "Liked this place",
  "Good service and atmosphere",
  "Solid experience",
  "Worth visiting",
  "Had a pleasant time",
  "Generally very good",
  "Good place to go",
  "Nice experience",
];

const openings3 = [
  "It was okay",
  "Average experience",
  "Decent place",
  "It was alright",
  "Mixed feelings about this place",
  "Not bad, not great either",
  "Okay for a quick visit",
  "Had an okay time here",
  "It was fine",
  "Average overall",
];

const openings2 = [
  "Expected a bit more",
  "Not the best experience",
  "Could be better",
  "Left a bit disappointed",
  "Had some issues here",
  "Service could improve",
  "Not what I hoped for",
  "Below my expectations",
];

const openings1 = [
  "Really disappointed",
  "Not a good experience",
  "Would not recommend",
  "Very poor service",
  "Left unhappy",
  "Worst experience in a while",
  "Needs a lot of improvement",
  "Not satisfied at all",
];

const positives = [
  "staff were friendly and helpful",
  "service was quick and attentive",
  "place was clean and well maintained",
  "atmosphere was calm and welcoming",
  "staff really care about customers",
  "everything felt organized",
  "team was professional",
  "service felt personal and warm",
  "place has a nice vibe",
  "staff made us feel comfortable",
  "management is doing a good job",
  "you can see they put effort into details",
  "service was smooth",
  "place felt welcoming from the start",
  "staff were polite and respectful",
];

const positives4 = [
  "staff were friendly",
  "service was good",
  "place was clean",
  "overall atmosphere was nice",
  "staff were helpful",
  "things were well managed",
  "good attention to customers",
  "felt comfortable here",
  "service was decent and quick",
  "staff tried their best",
];

const neutrals = [
  "service was okay",
  "place was average",
  "it was a normal experience",
  "nothing special but not bad",
  "could be a bit more organized",
  "wait time was a bit long",
  "staff seemed busy",
  "place was a bit crowded",
  "decent but has room to improve",
  "it was fine for the price",
];

const negatives2 = [
  "service was quite slow",
  "staff seemed uninterested",
  "place was not very clean",
  "had to wait longer than expected",
  "staff could be more friendly",
  "management needs to look into this",
  "felt a bit disorganized",
  "not very attentive to customers",
];

const negatives1 = [
  "service was very slow and careless",
  "staff were rude and unhelpful",
  "place was dirty and poorly managed",
  "waited a long time with no update",
  "felt ignored the whole time",
  "very unprofessional behavior",
  "will not be coming back",
  "needs serious improvement",
];

const closings5 = [
  "Will come again soon.",
  "Highly recommend to others.",
  "Keep up the good work!",
  "Thank you for the great experience.",
  "Looking forward to next time.",
  "Definitely worth a visit.",
  "Great job by the whole team.",
  "Will tell my friends about this place.",
  "One of my favorite places now.",
  "Really appreciate the effort.",
];

const closings4 = [
  "Will visit again.",
  "Overall happy with it.",
  "Good job, keep it up.",
  "Recommend giving it a try.",
  "Worth coming back.",
  "Nice work by the team.",
  "Would come again.",
  "Good experience overall.",
];

const closings3 = [
  "Might come back if improvements are made.",
  "Okay for now.",
  "Hope they improve a bit.",
  "Average, but okay.",
  "Could be better next time.",
  "Fine for a one-time visit.",
];

const closings2 = [
  "Hope they improve their service.",
  "Not sure if I will come back.",
  "Needs to work on customer service.",
  "Expect better next time.",
  "Disappointed this time.",
];

const closings1 = [
  "Very disappointed.",
  "Needs a lot of work.",
  "Would not come back.",
  "Not recommended.",
  "Hope management takes action.",
  "Unacceptable experience.",
];

const connectors = [" Also, ", " And ", " ", " Plus, ", " What I liked is ", " I also noticed "];

function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function maybeIncludeBusinessName(name: string | undefined, probability = 0.3): string {
  if (!name) return "";
  if (Math.random() > probability) return "";
  const templates = [
    ` at ${name}`,
    ` - ${name} is doing well`,
    ` ${name} is a good choice`,
    ` Thanks ${name}`,
  ];
  return random(templates);
}

export function generateReview(rating: Rating, business?: BusinessContext): string {
  const bizName = business?.name?.trim();
  const cat = business?.subcategory || business?.category || "";

  let review = "";

  // Choose opening based on rating
  let opening = "";
  let middleParts: string[] = [];
  let closing = "";

  const useBizName = Math.random() > 0.5;

  if (rating === 5) {
    opening = random(openings5);
    const count = randomInt(1, 2);
    for (let i = 0; i < count; i++) middleParts.push(random(positives));
    closing = random(closings5);
  } else if (rating === 4) {
    opening = random(openings4);
    const count = randomInt(1, 2);
    for (let i = 0; i < count; i++) middleParts.push(random(positives4));
    if (Math.random() > 0.6) middleParts.push(random(neutrals).replace("okay", "mostly good"));
    closing = random(closings4);
  } else if (rating === 3) {
    opening = random(openings3);
    middleParts.push(random(neutrals));
    if (Math.random() > 0.5) middleParts.push(random(positives4));
    closing = random(closings3);
  } else if (rating === 2) {
    opening = random(openings2);
    middleParts.push(random(negatives2));
    if (Math.random() > 0.5) middleParts.push(random(positives4));
    closing = random(closings2);
  } else {
    opening = random(openings1);
    middleParts.push(random(negatives1));
    if (Math.random() > 0.7) middleParts.push(random(negatives2));
    closing = random(closings1);
  }

  // Build review with varied structure
  const structure = randomInt(1, 4);

  let sentences: string[] = [];

  if (structure === 1) {
    sentences.push(opening + (useBizName && bizName ? ` at ${bizName}` : "") + ".");
    middleParts.forEach((p, i) => {
      const cap = p.charAt(0).toUpperCase() + p.slice(1);
      sentences.push(cap + ".");
    });
    sentences.push(closing);
  } else if (structure === 2) {
    const first = opening + ". " + (middleParts[0] ? middleParts[0].charAt(0).toUpperCase() + middleParts[0].slice(1) + "." : "");
    sentences.push(first);
    if (middleParts[1]) sentences.push(middleParts[1].charAt(0).toUpperCase() + middleParts[1].slice(1) + ".");
    sentences.push(closing);
  } else if (structure === 3) {
    sentences.push(opening + ".");
    const combined = middleParts.map(p => p).join(", and ");
    if (combined) sentences.push(combined.charAt(0).toUpperCase() + combined.slice(1) + ".");
    sentences.push(closing);
  } else {
    sentences.push(opening + (bizName && Math.random() > 0.6 ? ` - ${bizName}` : "") + ".");
    middleParts.forEach(p => {
      const connector = random(connectors).trim();
      if (connector) sentences.push(connector + " " + p + ".");
      else sentences.push(p.charAt(0).toUpperCase() + p.slice(1) + ".");
    });
    sentences.push(closing);
  }

  review = sentences.join(" ").replace(/\s+/g, " ").trim();

  // Ensure uniqueness tweak - add small variation
  if (Math.random() > 0.7 && rating >= 4) {
    const extras = [" Loved it.", " Really good.", " Nice one.", " Good place."];
    if (!review.includes("Loved") && Math.random() > 0.5) review = review.replace(/\.$/, "") + random(extras);
  }

  // Length variation - sometimes short, sometimes longer
  // Trim if too long
  if (review.length > 320) {
    // shorten
    const parts = review.split(". ");
    review = parts.slice(0, 2).join(". ") + ". " + parts[parts.length - 1];
  }

  // Ensure first letter capital and ends with period
  review = review.charAt(0).toUpperCase() + review.slice(1);
  if (!review.endsWith(".")) review += ".";

  // Remove double periods
  review = review.replace(/\.\./g, ".").replace(/\s+\./g, ".");

  return review;
}

// Generate unique coupon
export function generateCouponCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segment = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `QRMD-${segment(4)}-${segment(4)}`;
}
