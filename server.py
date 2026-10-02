#!/usr/bin/env python3
"""
Paletton Local Server with Python-powered Export & Sharing
Handles static file serving, /export/index.php (HTML, CSS, LESS, SASS, XML, TXT, ACO, GPL, Sketch, PNG),
and /palette.php (Share palette redirect).
"""

import http.server
import socketserver
import urllib.parse
import json
import struct
import io
import os
import sys
import math

try:
    from PIL import Image, ImageDraw, ImageFont
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


def generate_html_export(uid, scheme):
    groups_html = ""
    for group_key, group_val in scheme.items():
        title = group_val.get("ttl", group_key)
        colors = group_val.get("col", [])
        
        swatches = ""
        for c in colors:
            hex_code = c.get("hex", "000000").upper()
            r, g, b = c.get("r", 0), c.get("g", 0), c.get("b", 0)
            idx = c.get("idx", 0)
            is_main = "★ " if idx == 0 else ""
            # Calculate luminance for text contrast
            lum = (0.299 * r + 0.587 * g + 0.114 * b)
            text_col = "#000000" if lum > 140 else "#FFFFFF"
            
            swatches += f"""
            <div class="swatch" style="background-color: #{hex_code}; color: {text_col};">
                <span class="swatch-label">{is_main}#{hex_code}</span>
                <span class="swatch-rgb">rgb({r}, {g}, {b})</span>
            </div>
            """
        
        groups_html += f"""
        <div class="group-card">
            <h3>{title}</h3>
            <div class="swatch-row">
                {swatches}
            </div>
        </div>
        """

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Color Scheme Export — {uid}</title>
    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #1a1a1a;
            color: #e0e0e0;
            padding: 30px 20px;
        }}
        .container {{
            max-width: 960px;
            margin: 0 auto;
        }}
        header {{
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            flex-wrap: wrap;
            gap: 15px;
        }}
        h1 {{ font-size: 26px; color: #fff; font-weight: 600; }}
        .meta {{ font-size: 14px; color: #888; }}
        .meta a {{ color: #4da6ff; text-decoration: none; }}
        .meta a:hover {{ text-decoration: underline; }}
        .group-card {{
            background: #242424;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        }}
        .group-card h3 {{
            margin-bottom: 15px;
            font-size: 18px;
            color: #ddd;
        }}
        .swatch-row {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 12px;
        }}
        .swatch {{
            height: 110px;
            border-radius: 6px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            cursor: pointer;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
            user-select: all;
        }}
        .swatch:hover {{
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        }}
        .swatch-label {{ font-weight: 700; font-size: 15px; font-family: monospace; }}
        .swatch-rgb {{ font-size: 12px; opacity: 0.85; font-family: monospace; margin-top: 4px; }}
        footer {{
            margin-top: 40px;
            text-align: center;
            font-size: 13px;
            color: #666;
        }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div>
                <h1>Color Palette</h1>
                <div class="meta">Palette UID: <code>{uid}</code></div>
            </div>
            <div class="meta">
                <a href="/#uid={uid}">← Open in Color Scheme Designer</a>
            </div>
        </header>

        <main>
            {groups_html}
        </main>

        <footer>
            Exported from Color Scheme Designer. Click any swatch to select color code.
        </footer>
    </div>
</body>
</html>"""


def srgb_to_oklch(r, g, b):
    def to_l(c):
        v = c / 255.0
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    r_l, g_l, b_l = to_l(r), to_l(g), to_l(b)
    l = 0.4122214708 * r_l + 0.5363325363 * g_l + 0.0514459929 * b_l
    m = 0.2119034982 * r_l + 0.6806995451 * g_l + 0.1073969566 * b_l
    s = 0.0883024619 * r_l + 0.2817188376 * g_l + 0.6299787005 * b_l
    l_ = l ** (1.0 / 3.0) if l > 0 else 0
    m_ = m ** (1.0 / 3.0) if m > 0 else 0
    s_ = s ** (1.0 / 3.0) if s > 0 else 0
    L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
    a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
    b_v = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
    C = math.sqrt(a * a + b_v * b_v)
    H = math.atan2(b_v, a) * (180.0 / math.pi)
    if H < 0:
        H += 360.0
    return L, C, H


def oklch_to_srgb(L, C, H):
    if L <= 0.0001:
        return 0, 0, 0
    if L >= 0.9999:
        return 255, 255, 255
    h_rad = math.radians(H)
    a = C * math.cos(h_rad)
    b = C * math.sin(h_rad)
    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l = l_ * l_ * l_
    m = m_ * m_ * m_
    s = s_ * s_ * s_
    r_l = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    g_l = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    b_l = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    def to_srgb(c):
        v = 12.92 * c if c <= 0.0031308 else 1.055 * (max(0.0, c) ** (1.0 / 2.4)) - 0.055
        return round(max(0, min(255, v * 255.0)))
    return to_srgb(r_l), to_srgb(g_l), to_srgb(b_l)


TONAL_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
TONAL_LIGHTNESS = {
    50: 0.98, 100: 0.94, 200: 0.86, 300: 0.77, 400: 0.67,
    500: 0.56, 600: 0.46, 700: 0.36, 800: 0.27, 900: 0.18, 950: 0.11
}


def generate_tonal_scale(r, g, b, hue_shift=4.0):
    base_L, base_C, base_H = srgb_to_oklch(r, g, b)
    max_c = max(0.04, base_C)
    scale = {}
    for step in TONAL_STEPS:
        target_l = TONAL_LIGHTNESS[step]
        dist = abs(target_l - 0.55)
        chroma_factor = max(0.15, 1.0 - dist * 1.5)
        step_c = max_c * chroma_factor
        step_h = base_H
        if hue_shift > 0:
            shift = (target_l - 0.55) * 2.0
            step_h = (base_H + shift * hue_shift + 360.0) % 360.0
        sr, sg, sb = oklch_to_srgb(target_l, step_c, step_h)
        hex_str = f"#{sr:02X}{sg:02X}{sb:02X}"
        oklch_str = f"oklch({target_l*100:.1f}% {step_c:.3f} {step_h:.1f})"
        scale[step] = {
            "hex": hex_str,
            "oklch": oklch_str,
            "r": sr, "g": sg, "b": sb,
            "L": target_l, "C": step_c, "H": step_h
        }
    return scale


def generate_oklch_css_export(uid, scheme):
    lines = [
        "/**",
        " * Modern OKLCH CSS Palette & Tonal Scales",
        f" * Palette UID: {uid}",
        " * Generated by Color Scheme Designer",
        " */",
        "",
        ":root {"
    ]
    for group_key, group_val in scheme.items():
        clean_group = group_key.lower().replace(" ", "-")
        lines.append(f"  /* {group_val.get('ttl', group_key)} */")
        base_color = None
        for c in group_val.get("col", []):
            idx = c.get("idx", 0)
            r, g, b = c.get("r", 0), c.get("g", 0), c.get("b", 0)
            hex_code = c.get("hex", "000000").upper()
            L, C, H = srgb_to_oklch(r, g, b)
            oklch_str = f"oklch({L*100:.1f}% {C:.3f} {H:.1f})"
            lines.append(f"  --color-{clean_group}-{idx}: {oklch_str}; /* #{hex_code} */")
            if idx == 0:
                base_color = (r, g, b)

        if base_color:
            lines.append(f"  /* {group_val.get('ttl', group_key)} - 11-step Tonal Scale (50..950) */")
            scale = generate_tonal_scale(*base_color)
            for step in TONAL_STEPS:
                lines.append(f"  --color-{clean_group}-{step}: {scale[step]['oklch']}; /* {scale[step]['hex']} */")
        lines.append("")

    lines.append("}\n")

    # Utility classes
    for group_key, group_val in scheme.items():
        clean_group = group_key.lower().replace(" ", "-")
        base_color = None
        for c in group_val.get("col", []):
            idx = c.get("idx", 0)
            if idx == 0:
                base_color = (c.get("r", 0), c.get("g", 0), c.get("b", 0))
            lines.append(f".color-{clean_group}-{idx} {{ color: var(--color-{clean_group}-{idx}); }}")
            lines.append(f".bg-{clean_group}-{idx} {{ background-color: var(--color-{clean_group}-{idx}); }}")

        if base_color:
            for step in TONAL_STEPS:
                lines.append(f".color-{clean_group}-{step} {{ color: var(--color-{clean_group}-{step}); }}")
                lines.append(f".bg-{clean_group}-{step} {{ background-color: var(--color-{clean_group}-{step}); }}")

    return "\n".join(lines) + "\n"


def generate_tailwind_export(uid, scheme):
    lines = [
        "/**",
        " * Tailwind CSS Color Theme Configuration (50–950)",
        f" * Palette UID: {uid}",
        " * Generated by Color Scheme Designer",
        " */",
        "",
        "/** @type {import('tailwindcss').Config} */",
        "module.exports = {",
        "  theme: {",
        "    extend: {",
        "      colors: {"
    ]

    group_keys = list(scheme.keys())
    for gi, group_key in enumerate(group_keys):
        group_val = scheme[group_key]
        clean_group = group_key.lower().replace(" ", "").replace("-", "")
        name_map = {
            "primary": "primary", "pri": "primary",
            "secondary1": "secondary1", "secondary-1": "secondary1", "sec1": "secondary1",
            "secondary2": "secondary2", "secondary-2": "secondary2", "sec2": "secondary2",
            "complement": "complement", "compl": "complement"
        }
        group_name = name_map.get(clean_group, clean_group)
        cols = group_val.get("col", [])
        base_c = next((c for c in cols if c.get("idx") == 0), cols[0] if cols else None)

        lines.append(f"        {group_name}: {{")
        if base_c:
            base_r = base_c.get("r", 0)
            base_g = base_c.get("g", 0)
            base_b = base_c.get("b", 0)
            base_hex = base_c.get("hex", "000000").upper()
            lines.append(f"          DEFAULT: '#{base_hex}',")
            scale = generate_tonal_scale(base_r, base_g, base_b)
            for step in TONAL_STEPS:
                lines.append(f"          {step}: '{scale[step]['hex']}',")
        for c in cols:
            idx = c.get("idx", 0)
            lines.append(f"          'shade-{idx}': '#{c.get('hex', '000000').upper()}',")

        comma = "," if gi < len(group_keys) - 1 else ""
        lines.append(f"        }}{comma}")

    lines.extend([
        "      }",
        "    }",
        "  }",
        "};\n"
    ])
    return "\n".join(lines)


def generate_dtcg_export(uid, scheme):
    tokens = {
        "$schema": "https://design-tokens.github.io/community-group/format/",
        "color": {}
    }
    for group_key, group_val in scheme.items():
        clean_group = group_key.lower().replace(" ", "-")
        cols = group_val.get("col", [])
        base_c = next((c for c in cols if c.get("idx") == 0), cols[0] if cols else None)
        group_tokens = {}
        if base_c:
            br, bg, bb = base_c.get("r", 0), base_c.get("g", 0), base_c.get("b", 0)
            L, C, H = srgb_to_oklch(br, bg, bb)
            group_tokens["base"] = {
                "$value": f"#{base_c.get('hex', '000000').upper()}",
                "$type": "color",
                "$description": f"{group_val.get('ttl', group_key)} base color - oklch({L*100:.1f}% {C:.3f} {H:.1f})"
            }
            scale = generate_tonal_scale(br, bg, bb)
            for step in TONAL_STEPS:
                group_tokens[str(step)] = {
                    "$value": scale[step]["hex"],
                    "$type": "color",
                    "$description": f"Tonal step {step} - {scale[step]['oklch']}"
                }
        for c in cols:
            idx = c.get("idx", 0)
            cr, cg, cb = c.get("r", 0), c.get("g", 0), c.get("b", 0)
            L, C, H = srgb_to_oklch(cr, cg, cb)
            group_tokens[f"shade-{idx}"] = {
                "$value": f"#{c.get('hex', '000000').upper()}",
                "$type": "color",
                "$description": f"Classic shade {idx} - oklch({L*100:.1f}% {C:.3f} {H:.1f})"
            }
        tokens["color"][clean_group] = group_tokens

    return json.dumps(tokens, indent=2) + "\n"


def generate_figma_export(uid, scheme):
    tokens_global = {}
    figma_vars = []

    for group_key, group_val in scheme.items():
        clean_group = group_key.lower().replace(" ", "").replace("-", "")
        name_map = {
            "primary": "primary", "pri": "primary",
            "secondary1": "secondary-1", "secondary-1": "secondary-1", "sec1": "secondary-1",
            "secondary2": "secondary-2", "secondary-2": "secondary-2", "sec2": "secondary-2",
            "complement": "complement", "compl": "complement"
        }
        grp_name = name_map.get(clean_group, clean_group)
        cols = group_val.get("col", [])
        base_c = next((c for c in cols if c.get("idx") == 0), cols[0] if cols else None)

        group_tokens = {}
        if base_c:
            br, bg, bb = base_c.get("r", 0), base_c.get("g", 0), base_c.get("b", 0)
            base_hex = f"#{base_c.get('hex', '000000').upper()}"
            L, C, H = srgb_to_oklch(br, bg, bb)

            group_tokens["base"] = {
                "value": base_hex,
                "type": "color",
                "description": f"{group_val.get('ttl', group_key)} base - oklch({L*100:.1f}% {C:.3f} {H:.1f})"
            }
            figma_vars.append({
                "name": f"{grp_name}/base",
                "type": "COLOR",
                "description": f"Base color for {grp_name}",
                "valuesByMode": {
                    "Mode 1": { "r": round(br / 255.0, 4), "g": round(bg / 255.0, 4), "b": round(bb / 255.0, 4), "a": 1.0 }
                }
            })

            scale = generate_tonal_scale(br, bg, bb)
            for step in TONAL_STEPS:
                s_data = scale[step]
                group_tokens[str(step)] = {
                    "value": s_data["hex"],
                    "type": "color",
                    "description": f"Tonal step {step} - {s_data['oklch']}"
                }
                figma_vars.append({
                    "name": f"{grp_name}/{step}",
                    "type": "COLOR",
                    "description": f"Tonal step {step}",
                    "valuesByMode": {
                        "Mode 1": { "r": round(s_data["r"] / 255.0, 4), "g": round(s_data["g"] / 255.0, 4), "b": round(s_data["b"] / 255.0, 4), "a": 1.0 }
                    }
                })

        for c in cols:
            idx = c.get("idx", 0)
            cr, cg, cb = c.get("r", 0), c.get("g", 0), c.get("b", 0)
            c_hex = f"#{c.get('hex', '000000').upper()}"
            group_tokens[f"shade-{idx}"] = {
                "value": c_hex,
                "type": "color",
                "description": f"Classic shade {idx}"
            }
            figma_vars.append({
                "name": f"{grp_name}/shade-{idx}",
                "type": "COLOR",
                "description": f"Classic shade {idx}",
                "valuesByMode": {
                    "Mode 1": { "r": round(cr / 255.0, 4), "g": round(cg / 255.0, 4), "b": round(cb / 255.0, 4), "a": 1.0 }
                }
            })

        tokens_global[grp_name] = group_tokens

    result = {
        "global": tokens_global,
        "$metadata": {
            "tokenSetOrder": ["global"],
            "paletteUid": uid,
            "format": "Tokens Studio & Figma Variables",
            "generator": "Color Scheme Designer"
        },
        "figmaVariables": {
            "collectionName": "Paletton Colors",
            "modes": ["Mode 1"],
            "variables": figma_vars
        }
    }
    return json.dumps(result, indent=2) + "\n"


def generate_svg_export(uid, scheme):
    groups = list(scheme.items())
    group_count = len(groups)
    card_width = 780
    card_height = 80 + group_count * 115

    svg = [
        f'<svg width="{card_width}" height="{card_height}" viewBox="0 0 {card_width} {card_height}" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif">',
        f'  <rect width="100%" height="100%" fill="#141518" rx="14"/>',
        f'  <text x="32" y="44" fill="#FFFFFF" font-size="18" font-weight="700">Color Palette</text>',
        f'  <text x="165" y="44" fill="#71717A" font-size="12">UID: {uid} • Figma Vector Artboard</text>'
    ]

    y = 75
    for group_key, group_val in groups:
        title = group_val.get("ttl", group_key)
        cols = group_val.get("col", [])
        base_c = next((c for c in cols if c.get("idx") == 0), cols[0] if cols else None)

        svg.append(f'  <g transform="translate(32, {y})">')
        svg.append(f'    <text x="0" y="16" fill="#A1A1AA" font-size="12" font-weight="600">{title}</text>')

        # 5 Classic Swatches
        x = 0
        swatch_w = 46
        swatch_h = 28
        for c in cols:
            hex_c = f"#{c.get('hex', '000000').upper()}"
            is_light = (c.get('r', 0) * 0.299 + c.get('g', 0) * 0.587 + c.get('b', 0) * 0.114) > 140
            text_col = "#000000" if is_light else "#FFFFFF"
            svg.append(f'    <rect x="{x}" y="26" width="{swatch_w}" height="{swatch_h}" rx="4" fill="{hex_c}"/>')
            svg.append(f'    <text x="{x + swatch_w/2}" y="43" fill="{text_col}" font-size="8" font-weight="600" text-anchor="middle">{hex_c}</text>')
            x += swatch_w + 4

        # Tonal Scale (11 steps)
        if base_c:
            br, bg, bb = base_c.get("r", 0), base_c.get("g", 0), base_c.get("b", 0)
            scale = generate_tonal_scale(br, bg, bb)
            tx = 265
            t_w = 38
            t_h = 28
            for step in TONAL_STEPS:
                s_hex = scale[step]["hex"]
                is_light = (scale[step]['r'] * 0.299 + scale[step]['g'] * 0.587 + scale[step]['b'] * 0.114) > 140
                t_col = "#000000" if is_light else "#FFFFFF"
                svg.append(f'    <rect x="{tx}" y="26" width="{t_w}" height="{t_h}" rx="3" fill="{s_hex}"/>')
                svg.append(f'    <text x="{tx + t_w/2}" y="38" fill="{t_col}" font-size="8" font-weight="700" text-anchor="middle">{step}</text>')
                svg.append(f'    <text x="{tx + t_w/2}" y="48" fill="{t_col}" font-size="6.5" opacity="0.85" text-anchor="middle">{s_hex}</text>')
                tx += t_w + 2

        svg.append('  </g>')
        y += 105

    svg.append('</svg>\n')
    return "\n".join(svg)


def generate_css_export(uid, scheme):
    lines = [
        f"/* Color Scheme */",
        f"/* UID: {uid} */",
        f"/* Generated by Color Scheme Designer */",
        "",
        ":root {"
    ]
    # CSS Custom Properties
    for group_key, group_val in scheme.items():
        clean_group = group_key.lower().replace(" ", "-")
        for c in group_val.get("col", []):
            idx = c.get("idx", 0)
            hex_code = c.get("hex", "000000").upper()
            lines.append(f"  --color-{clean_group}-{idx}: #{hex_code};")

    lines.append("}\n")

    # Utility classes
    for group_key, group_val in scheme.items():
        clean_group = group_key.lower().replace(" ", "-")
        for c in group_val.get("col", []):
            idx = c.get("idx", 0)
            hex_code = c.get("hex", "000000").upper()
            lines.append(f".color-{clean_group}-{idx} {{ color: #{hex_code}; }}")
            lines.append(f".bg-{clean_group}-{idx} {{ background-color: #{hex_code}; }}")

    return "\n".join(lines) + "\n"


def generate_less_export(uid, scheme):
    lines = [
        f"// Color Scheme (LESS)",
        f"// UID: {uid}",
        ""
    ]
    for group_key, group_val in scheme.items():
        clean_group = group_key.lower().replace(" ", "-")
        for c in group_val.get("col", []):
            idx = c.get("idx", 0)
            hex_code = c.get("hex", "000000").upper()
            lines.append(f"@color-{clean_group}-{idx}: #{hex_code};")
    return "\n".join(lines) + "\n"


def generate_sass_export(uid, scheme):
    lines = [
        f"// Color Scheme (SASS/SCSS)",
        f"// UID: {uid}",
        ""
    ]
    for group_key, group_val in scheme.items():
        clean_group = group_key.lower().replace(" ", "-")
        for c in group_val.get("col", []):
            idx = c.get("idx", 0)
            hex_code = c.get("hex", "000000").upper()
            lines.append(f"${clean_group}-{idx}: #{hex_code};")
    return "\n".join(lines) + "\n"


def generate_xml_export(uid, scheme):
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<palette id="{uid}" generator="Color Scheme Designer">'
    ]
    for group_key, group_val in scheme.items():
        ttl = group_val.get("ttl", group_key)
        lines.append(f'  <group id="{group_key}" title="{ttl}">')
        for c in group_val.get("col", []):
            idx = c.get("idx", 0)
            hex_code = c.get("hex", "000000").upper()
            r, g, b = c.get("r", 0), c.get("g", 0), c.get("b", 0)
            lines.append(f'    <color idx="{idx}" hex="{hex_code}" r="{r}" g="{g}" b="{b}" />')
        lines.append('  </group>')
    lines.append('</palette>')
    return "\n".join(lines) + "\n"


def generate_txt_export(uid, scheme):
    lines = [
        f"==================================================",
        f" COLOR PALETTE",
        f" UID: {uid}",
        f" URL: http://localhost:{PORT}/#uid={uid}",
        f"==================================================",
        ""
    ]
    for group_key, group_val in scheme.items():
        ttl = group_val.get("ttl", group_key)
        lines.append(f"[{ttl.upper()}]")
        for c in group_val.get("col", []):
            idx = c.get("idx", 0)
            hex_code = c.get("hex", "000000").upper()
            r, g, b = c.get("r", 0), c.get("g", 0), c.get("b", 0)
            lines.append(f"  Shade {idx}: #{hex_code}  RGB({r:>3}, {g:>3}, {b:>3})")
        lines.append("")
    return "\n".join(lines) + "\n"


def generate_gpl_export(uid, scheme):
    lines = [
        "GIMP Palette",
        f"Name: Palette_{uid}",
        "Columns: 5",
        "#"
    ]
    for group_key, group_val in scheme.items():
        ttl = group_val.get("ttl", group_key)
        for c in group_val.get("col", []):
            idx = c.get("idx", 0)
            r, g, b = c.get("r", 0), c.get("g", 0), c.get("b", 0)
            lines.append(f"{r:>3} {g:>3} {b:>3}  {ttl}_{idx}")
    return "\n".join(lines) + "\n"


def generate_sketch_export(uid, scheme):
    colors = []
    for group_key, group_val in scheme.items():
        for c in group_val.get("col", []):
            r0 = c.get("r0", c.get("r", 0) / 255.0)
            g0 = c.get("g0", c.get("g", 0) / 255.0)
            b0 = c.get("b0", c.get("b", 0) / 255.0)
            colors.append({
                "red": round(r0, 4),
                "green": round(g0, 4),
                "blue": round(b0, 4),
                "alpha": 1.0
            })
    return json.dumps({
        "compatibleVersion": "2.0",
        "pluginVersion": "2.22",
        "colors": colors
    }, indent=2)


def generate_aco_export(scheme):
    """
    Photoshop .aco binary palette (v1 and v2 blocks).
    """
    all_colors = []
    for group_key, group_val in scheme.items():
        ttl = group_val.get("ttl", group_key)
        for c in group_val.get("col", []):
            idx = c.get("idx", 0)
            r = c.get("r", 0)
            g = c.get("g", 0)
            b = c.get("b", 0)
            name = f"{ttl} {idx}"
            all_colors.append((r, g, b, name))

    buf = bytearray()
    count = len(all_colors)

    # Version 1 block
    buf.extend(struct.pack(">HH", 1, count))
    for r, g, b, _ in all_colors:
        buf.extend(struct.pack(">HHHHH", 0, r * 257, g * 257, b * 257, 0))

    # Version 2 block (with color names in UTF-16BE)
    buf.extend(struct.pack(">HH", 2, count))
    for r, g, b, name in all_colors:
        buf.extend(struct.pack(">HHHHH", 0, r * 257, g * 257, b * 257, 0))
        encoded_name = (name + "\0").encode("utf-16-be")
        char_len = len(name) + 1
        buf.extend(struct.pack(">I", char_len))
        buf.extend(encoded_name)

    return bytes(buf)


def generate_png_export(uid, scheme):
    """
    Generate an image swatch grid as PNG bytes.
    """
    if HAS_PIL:
        groups = list(scheme.values())
        num_groups = len(groups)
        num_cols = max((len(g.get("col", [])) for g in groups), default=5)
        
        swatch_w, swatch_h = 100, 100
        padding = 20
        title_h = 30
        
        img_w = padding * 2 + num_cols * swatch_w + (num_cols - 1) * 8
        img_h = padding * 2 + num_groups * (swatch_h + title_h + 12)
        
        img = Image.new("RGB", (img_w, img_h), color=(30, 30, 30))
        draw = ImageDraw.Draw(img)
        
        y_offset = padding
        for g in groups:
            ttl = g.get("ttl", "")
            draw.text((padding, y_offset), ttl, fill=(220, 220, 220))
            y_offset += title_h
            
            x_offset = padding
            for c in g.get("col", []):
                r, g_val, b = c.get("r", 0), c.get("g", 0), c.get("b", 0)
                draw.rectangle([x_offset, y_offset, x_offset + swatch_w, y_offset + swatch_h], fill=(r, g_val, b))
                hex_str = "#" + c.get("hex", "000000").upper()
                lum = (0.299 * r + 0.587 * g_val + 0.114 * b)
                t_col = (0, 0, 0) if lum > 140 else (255, 255, 255)
                draw.text((x_offset + 8, y_offset + swatch_h - 22), hex_str, fill=t_col)
                x_offset += swatch_w + 8
            y_offset += swatch_h + 16

        out = io.BytesIO()
        img.save(out, format="PNG")
        return out.getvalue()
    else:
        # 1x1 fallback PNG
        return b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\rIDATx\x9cc\xf8\xff\xff?\x03\x00\x08\xfc\x02\xfe\xa7\x9a\xa0\xa0\x00\x00\x00\x00IEND\xaeB`\x82'


class PalettonHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip('/')

        # Handle Share Palette redirect: /palette.php?uid=...
        if path == "/palette.php":
            query = urllib.parse.parse_qs(parsed.query)
            uid = query.get("uid", [""])[0]
            target = f"/#uid={uid}" if uid else "/"
            self.send_response(302)
            self.send_header("Location", target)
            self.send_header("Content-Length", "0")
            self.end_headers()
            return

        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path.startswith("/export") or path == "/export/index.php":
            content_length = int(self.headers.get("Content-Length", 0))
            post_body = self.rfile.read(content_length).decode("utf-8", errors="replace")
            params = urllib.parse.parse_qs(post_body)
            raw_data = params.get("data", [""])[0]

            if not raw_data:
                self.send_error(400, "Missing data parameter")
                return

            try:
                data = json.loads(raw_data)
            except Exception as e:
                self.send_error(400, f"Invalid JSON payload: {e}")
                return

            exp_type = data.get("type", "html").lower()
            uid = data.get("id", "palette")
            scheme = data.get("scheme", {})

            content_type = "text/plain; charset=utf-8"
            extra_headers = []
            response_bytes = b""

            if exp_type == "html":
                content_type = "text/html; charset=utf-8"
                response_bytes = generate_html_export(uid, scheme).encode("utf-8")
            elif exp_type == "css":
                content_type = "text/css; charset=utf-8"
                extra_headers.append(("Content-Disposition", f'inline; filename="paletton-{uid}.css"'))
                response_bytes = generate_css_export(uid, scheme).encode("utf-8")
            elif exp_type == "oklch":
                content_type = "text/css; charset=utf-8"
                extra_headers.append(("Content-Disposition", f'inline; filename="paletton-{uid}-oklch.css"'))
                response_bytes = generate_oklch_css_export(uid, scheme).encode("utf-8")
            elif exp_type == "tailwind":
                content_type = "application/javascript; charset=utf-8"
                extra_headers.append(("Content-Disposition", f'inline; filename="tailwind.config.js"'))
                response_bytes = generate_tailwind_export(uid, scheme).encode("utf-8")
            elif exp_type == "dtcg":
                content_type = "application/json; charset=utf-8"
                extra_headers.append(("Content-Disposition", f'inline; filename="tokens-{uid}.json"'))
                response_bytes = generate_dtcg_export(uid, scheme).encode("utf-8")
            elif exp_type == "figma":
                content_type = "application/json; charset=utf-8"
                extra_headers.append(("Content-Disposition", f'attachment; filename="figma-tokens-{uid}.json"'))
                response_bytes = generate_figma_export(uid, scheme).encode("utf-8")
            elif exp_type == "svg":
                content_type = "image/svg+xml; charset=utf-8"
                extra_headers.append(("Content-Disposition", f'inline; filename="paletton-{uid}.svg"'))
                response_bytes = generate_svg_export(uid, scheme).encode("utf-8")
            elif exp_type == "less":
                content_type = "text/plain; charset=utf-8"
                extra_headers.append(("Content-Disposition", f'inline; filename="paletton-{uid}.less"'))
                response_bytes = generate_less_export(uid, scheme).encode("utf-8")
            elif exp_type == "sass":
                content_type = "text/plain; charset=utf-8"
                extra_headers.append(("Content-Disposition", f'inline; filename="paletton-{uid}.scss"'))
                response_bytes = generate_sass_export(uid, scheme).encode("utf-8")
            elif exp_type == "xml":
                content_type = "application/xml; charset=utf-8"
                extra_headers.append(("Content-Disposition", f'inline; filename="paletton-{uid}.xml"'))
                response_bytes = generate_xml_export(uid, scheme).encode("utf-8")
            elif exp_type in ("txt", "text"):
                content_type = "text/plain; charset=utf-8"
                extra_headers.append(("Content-Disposition", f'inline; filename="paletton-{uid}.txt"'))
                response_bytes = generate_txt_export(uid, scheme).encode("utf-8")
            elif exp_type == "gpl":
                content_type = "text/plain; charset=utf-8"
                extra_headers.append(("Content-Disposition", f'attachment; filename="paletton-{uid}.gpl"'))
                response_bytes = generate_gpl_export(uid, scheme).encode("utf-8")
            elif exp_type == "sketch":
                content_type = "application/json; charset=utf-8"
                extra_headers.append(("Content-Disposition", f'attachment; filename="paletton-{uid}.sketchpalette"'))
                response_bytes = generate_sketch_export(uid, scheme).encode("utf-8")
            elif exp_type == "aco":
                content_type = "application/octet-stream"
                extra_headers.append(("Content-Disposition", f'attachment; filename="paletton-{uid}.aco"'))
                response_bytes = generate_aco_export(scheme)
            elif exp_type == "png":
                content_type = "image/png"
                extra_headers.append(("Content-Disposition", f'inline; filename="paletton-{uid}.png"'))
                response_bytes = generate_png_export(uid, scheme)
            else:
                content_type = "application/json; charset=utf-8"
                response_bytes = json.dumps(data, indent=2).encode("utf-8")

            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(response_bytes)))
            for k, v in extra_headers:
                self.send_header(k, v)
            self.end_headers()
            self.wfile.write(response_bytes)
            return

        return super().do_POST()


class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True


def run(port=PORT):
    server_address = ("", port)
    with ThreadedTCPServer(server_address, PalettonHTTPRequestHandler) as httpd:
        print(f"Paletton Server running with Python Export at http://localhost:{port}/")
        print(f"Serving directory: {DIRECTORY}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            httpd.server_close()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    run(port)
