#!/usr/bin/env bash
# Daily IntoDNS MCP launch status snapshot.
# Run from anywhere — no args.
set -e
echo "=== IntoDNS MCP daily status — $(date -u +%Y-%m-%dT%H:%MZ) ==="
echo
echo "--- npm ---"
curl -s "https://api.npmjs.org/downloads/range/last-week/intodns-mcp" \
  | python3 -c "import json,sys;d=json.load(sys.stdin);print('weekly downloads:',sum(x['downloads'] for x in d.get('downloads',[])))"
echo
echo "--- GitHub ---"
gh api repos/RoscoNL/intodns-mcp-server \
  --jq '"stars: \(.stargazers_count) | forks: \(.forks_count) | watchers: \(.subscribers_count)"'
echo
echo "--- PR #6541 punkpeye/awesome-mcp-servers ---"
gh pr view 6541 --repo punkpeye/awesome-mcp-servers \
  --json state,mergedAt,labels \
  --jq '"state: \(.state) | merged: \(.mergedAt // "no") | labels: \(.labels|map(.name)|join(","))"' 2>/dev/null || echo "n/a"
echo
echo "--- Glama listing ---"
curl -s "https://glama.ai/mcp/servers/RoscoNL/intodns-mcp-server" -o /dev/null -w "HTTP %{http_code}\n"
echo
echo "--- X @intodnsai (HTML scrape) ---"
curl -s "https://x.com/intodnsai" 2>/dev/null \
  | grep -oE '"(followers_count|statuses_count|friends_count)":[0-9]+' \
  | head -3
echo
echo "=== done ==="
