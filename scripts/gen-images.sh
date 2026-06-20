#!/usr/bin/env bash
# Generate all images for sealcoatinginsurance.com via HuggingFace FLUX.1-schnell
# Robust: retries up to 4 times, verifies each is a valid image >= 30KB
set -uo pipefail

OUT="/workspace/Websites/sealcoatinginsurance.com/public/images"
mkdir -p "$OUT"

# gen <fname> <prompt> [steps] [width] [height]
gen() {
  local fname="$1"; shift
  local prompt="$1"; shift
  local steps="${1:-4}"; shift || true
  local w="${1:-1024}"; shift || true
  local h="${1:-1024}"; shift || true
  local dest="$OUT/$fname"
  local attempt=0
  while [ $attempt -lt 4 ]; do
    attempt=$((attempt+1))
    echo "[$fname] attempt $attempt (steps=$steps ${w}x${h})..."
    curl -s --max-time 200 \
      https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell \
      -H "Authorization: Bearer $HF_TOKEN" \
      -H "Content-Type: application/json" \
      -d "$(jq -nc --arg p "$prompt" --argjson s "$steps" --argjson w "$w" --argjson h "$h" '{inputs:$p, parameters:{num_inference_steps:$s, width:$w, height:$h}}')" \
      -o "$dest"
    local ftype; ftype=$(file -b "$dest" 2>/dev/null)
    local sz; sz=$(stat -c%s "$dest" 2>/dev/null || echo 0)
    if echo "$ftype" | grep -qiE "image|jpeg|png" && [ "$sz" -ge 30000 ]; then
      echo "[$fname] OK ($sz bytes, $ftype)"
      return 0
    fi
    echo "[$fname] FAIL (size=$sz, type=$ftype)"
    if echo "$ftype" | grep -qi "text\|json"; then head -c 200 "$dest"; echo ""; fi
    sleep 4
  done
  echo "[$fname] GAVE UP after $attempt attempts"
  return 1
}

# === 12 images — SEALCOATING CONTRACTOR insurance ===

gen "hero.jpg" \
  "Photorealistic wide cinematic shot of a professional sealcoating contractor operating an industrial asphalt sealcoating spray machine on a large commercial parking lot, fresh black asphalt sealer glistening in sunlight, professional industrial photography, no text, no watermark" 4

gen "coverage.jpg" \
  "Photorealistic aerial view of a commercial parking lot being sealcoated, half-done showing contrast between weathered gray asphalt and fresh black sealcoat, professional contractor equipment visible, no text" 4

gen "about.jpg" \
  "Photorealistic portrait of a friendly professional asphalt sealcoating contractor in work clothes and safety glasses, standing confidently next to a sealcoating spray truck, warm natural light, commercial photography, no text" 4

gen "og-image.jpg" \
  "Photorealistic wide panoramic photo of a sealcoating contractor applying fresh black asphalt sealer to a large commercial parking lot, spray machine in action, crisp yellow parking lot lines visible, professional industrial photography, no text" 4 1216 640

gen "general-liability.jpg" \
  "Photorealistic photo of a professional sealcoating contractor in safety vest and gloves operating a walk-behind asphalt sealer machine on a commercial parking lot, no text" 4

gen "tools-equipment.jpg" \
  "Photorealistic photo of professional sealcoating equipment — a stainless steel sealcoating tank, spray wand, crack fill machine, and line striper laid out professionally, clean industrial photography, no text" 4

gen "commercial-auto.jpg" \
  "Photorealistic photo of a professional sealcoating contractor truck with a large black sealcoating tank mounted in the bed, parked at a commercial property, clean commercial vehicle photography, no text" 4

gen "workers-compensation.jpg" \
  "Photorealistic photo of sealcoating crew workers in safety vests and gloves working safely on a large asphalt parking lot sealcoating project, professional safety photography, no text" 4

gen "contractor-pollution-liability.jpg" \
  "Photorealistic photo of a sealcoating contractor in full PPE applying asphalt sealer near a storm drain, safety cones surrounding the area, environmental awareness, professional photography, no text" 4

gen "umbrella.jpg" \
  "Photorealistic photo of a professional sealcoating business owner reviewing insurance documents at a clean office desk, confident expression, business setting, no text" 4

gen "inland-marine.jpg" \
  "Photorealistic photo of a sealcoating contractor loading equipment onto a trailer for transport, professional work truck and equipment visible, outdoor setting, no text" 4

gen "bonds.jpg" \
  "Photorealistic photo of a sealcoating contractor shaking hands with a property manager outside a freshly sealed commercial parking lot, professional business interaction, no text" 4

echo "=== ALL IMAGE GENERATION ATTEMPTS COMPLETE ==="
ls -la "$OUT"
