import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "leaderboard.json");

export function readLeaderboard() {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export function saveLeaderboard(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}