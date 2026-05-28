import { controlGaps, policyLane, summary } from "../src/services/conditionalAccessPostureBoardService.js";

console.log("conditional-access-posture-board demo");
console.log(summary());
console.log(policyLane().map((lane) => ({ lane: lane.lane, owner: lane.owner, status: lane.status })));
console.log(controlGaps().slice(0, 3));
