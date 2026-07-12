#!/usr/bin/env bash
# 用 Cloudflare API 把 danielchen23.com 指到 Vercel
# 用法：
#   1. 在 Cloudflare 建立 API Token（Zone.DNS Edit + Zone.Zone Read）
#   2. export CLOUDFLARE_API_TOKEN='你的token'   # 不要 commit
#   3. bash scripts/setup-cloudflare-dns.sh
#
# 資安：token 只放環境變數，勿寫進 Git

set -euo pipefail

DOMAIN="${DOMAIN:-danielchen23.com}"
TOKEN="${CLOUDFLARE_API_TOKEN:-}"

if [[ -z "$TOKEN" ]]; then
  echo "缺少 CLOUDFLARE_API_TOKEN"
  echo "到 https://dash.cloudflare.com/profile/api-tokens"
  echo "建立 Token：Edit zone DNS（含 Zone.DNS:Edit、Zone:Read）"
  echo "然後：export CLOUDFLARE_API_TOKEN='...'"
  exit 1
fi

API="https://api.cloudflare.com/client/v4"
AUTH=(-H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json")

echo "==> 查 zone: ${DOMAIN}"
ZONE_JSON=$(curl -sS "${API}/zones?name=${DOMAIN}" "${AUTH[@]}")
ZONE_ID=$(echo "$ZONE_JSON" | python3 -c "import sys,json; d=json.load(sys.stdin); r=d.get('result') or []; print(r[0]['id'] if r else '')")

if [[ -z "$ZONE_ID" ]]; then
  echo "找不到 zone。請先在 Cloudflare 新增網站 ${DOMAIN}，並把 Namecheap NS 改成 Cloudflare 的。"
  echo "API 回應 success=$(echo "$ZONE_JSON" | python3 -c "import sys,json; print(json.load(sys.stdin).get('success'))")"
  exit 1
fi
echo "zone_id=${ZONE_ID}"

upsert() {
  local type="$1" name="$2" content="$3"
  local fqdn="$name"
  if [[ "$name" == "@" ]]; then fqdn="$DOMAIN"; else fqdn="${name}.${DOMAIN}"; fi

  local existing
  existing=$(curl -sS "${API}/zones/${ZONE_ID}/dns_records?type=${type}&name=${fqdn}" "${AUTH[@]}")
  local rid
  rid=$(echo "$existing" | python3 -c "import sys,json; d=json.load(sys.stdin); r=d.get('result') or []; print(r[0]['id'] if r else '')")

  local body
  body=$(python3 -c "import json; print(json.dumps({'type':'''${type}''','name':'''${name}''','content':'''${content}''','ttl':1,'proxied':False}))")

  if [[ -n "$rid" ]]; then
    echo "更新 ${type} ${name} -> ${content}"
    curl -sS -X PUT "${API}/zones/${ZONE_ID}/dns_records/${rid}" "${AUTH[@]}" --data "$body" \
      | python3 -c "import sys,json; d=json.load(sys.stdin); print('ok' if d.get('success') else d)"
  else
    echo "新增 ${type} ${name} -> ${content}"
    curl -sS -X POST "${API}/zones/${ZONE_ID}/dns_records" "${AUTH[@]}" --data "$body" \
      | python3 -c "import sys,json; d=json.load(sys.stdin); print('ok' if d.get('success') else d)"
  fi
}

# Vercel 官方建議
upsert A "@" "76.76.21.21"
upsert CNAME "www" "cname.vercel-dns.com"

echo
echo "完成。請等幾分鐘後檢查："
echo "  dig +short ${DOMAIN}"
echo "  https://${DOMAIN}"
echo "  vercel domains inspect ${DOMAIN}"
