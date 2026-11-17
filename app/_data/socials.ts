// Speakers' public profile links, keyed by speaker slug (see slugify in _lib/speakers.ts).
// From the Sessionize API (Speakers view) on 2026-11-17: only the links speakers chose to
// put on their public profile. Sessionize-profile and Facebook links are left out.
// Ordered for display: LinkedIn first, then website, blog, X, Instagram, other.
export type Social = "linkedin" | "website" | "blog" | "twitter" | "instagram" | "other";

export const SOCIALS: Record<string, [Social, string][]> = {
  "adam-d-arcy": [["linkedin", "https://www.linkedin.com/in/adamedarcy/"], ["website", "https://adamdarcy.ai/"], ["blog", "https://medium.com/@adameddarcy"], ["other", "https://cyberresilience.dev/"]],
  "andrew-paul": [["linkedin", "https://www.linkedin.com/in/andrewpaul-ap"], ["website", "https://apunlimited.co.uk/"]],
  "chris-laughlin": [["linkedin", "https://www.linkedin.com/in/chris-laughlin-57a15425/"], ["blog", "https://thedyslexicdeveloper.com"], ["twitter", "https://twitter.com/chrislaughlin"]],
  "corey-duffy": [["linkedin", "https://www.linkedin.com/in/coreyduffy/"], ["blog", "https://thedebugdiary.beehiiv.com/"], ["twitter", "https://twitter.com/coreytalkscode"]],
  "denis-podgurskii": [["linkedin", "https://www.linkedin.com/in/denis-podgurskii/"], ["website", "https://pentestkit.co.uk/"], ["twitter", "https://x.com/pentestkit"]],
  "eve-brennan": [["linkedin", "https://www.linkedin.com/in/eve-brennan"], ["website", "https://businessinsider.com"], ["blog", "https://medium.com/@evebrennan2013"]],
  "iz-wright": [["linkedin", "https://www.linkedin.com/in/isobel-wright/"]],
  "jason-bell": [["linkedin", "https://www.linkedin.com/in/jasonbelldata/"], ["blog", "https://jasonbelldata.com"]],
  "louise-laughlin": [["linkedin", "http://linkedin.com/in/louiseyounger/"], ["twitter", "http://twitter.com/louiselaughlin_"]],
  "manuel-doncel-martos": [["linkedin", "https://www.linkedin.com/in/manueldoncelmartos/"], ["website", "https://www.ing.nl/"], ["blog", "https://manuelarte.github.io/"], ["twitter", "https://x.com/manueldoncel"], ["other", "https://github.com/manuelarte"], ["other", "https://dev.to/manuelarte"]],
  "marjia-siddik": [["linkedin", "https://linkedin.com/in/marjiasdk"]],
  "megan-d-arcy": [["linkedin", "https://www.linkedin.com/in/megan-d-arcy-953950203"]],
  "mike-irving": [["linkedin", "https://www.linkedin.com/in/mikeirving/"], ["blog", "https://www.mike-irving.co.uk/"], ["twitter", "https://twitter.com/mikeirvingweb"], ["instagram", "https://www.instagram.com/mikeirving1982/"], ["other", "https://github.com/mikeirvingweb"], ["other", "https://bsky.app/profile/mikeirvingweb.bsky.social"], ["other", "https://mastodon.social/@mikeirvingweb"]],
  "neil-mccallion": [["linkedin", "https://www.linkedin.com/in/neil-mccallion-311729ba"], ["blog", "https://codepen.io/njmcode"], ["twitter", "https://twitter.com/njmcode"]],
  "paul-barrett": [["twitter", "https://twitter.com/barrett_paul"]],
  "rachael-aluko": [["linkedin", "https://www.linkedin.com/in/rachael-aluko/"], ["instagram", "https://www.instagram.com/rae.the.creator/?hl=en-gb"]],
  "raj-dhruv": [["linkedin", "https://www.linkedin.com/in/rajdhruv11"]],
  "roman-zhukov": [["linkedin", "https://www.linkedin.com/in/rozhukov/"]],
  "samuel-dynes": [["linkedin", "https://uk.linkedin.com/in/samuel-dynes-7709a1150"]],
  "shreya-sahu": [["linkedin", "https://www.linkedin.com/in/shreya22/"], ["blog", "https://thelongerthought.substack.com/"], ["instagram", "https://www.instagram.com/thelongerthought"]],
  "stephen-mccullough": [["linkedin", "https://www.linkedin.com/in/theonlystephen/"], ["website", "https://www.exlservice.com/"], ["blog", "https://www.swm.cc/articles"], ["twitter", "https://www.twitter.com/theonlyswmcc"], ["instagram", "https://www.instagram.com/swmcc/"]],
  "yuan-zhang": [["linkedin", "https://www.linkedin.com/in/yuan-zhang-965aaa141/"], ["twitter", "https://twitter.com/YuanMitchell"]],
};
