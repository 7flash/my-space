# my-space — PCB Board Tasks

## 🔴 Priority: Fix
- [ ] **Verify actual part numbers against datasheets** — Current board uses placeholder pin mappings. Need real AllWinner T527 and Gowin GW2A-18 datasheets to map exact BGA ball assignments.
- [x] ~~**HDMI ESD protection missing**~~ — ✅ DONE. Added TPD12S016 ESD chip (QFN24) between SoC and HDMI connector with level shifting.
- [x] ~~**USB-C CC resistors missing**~~ — ✅ DONE. Added 5.1k pull-downs on CC1/CC2 for USB-C UFP sink power negotiation.

## 🟡 Priority: Improve
- [ ] **Add proper USB-C PD controller** — Current design just takes VBUS directly. Need FUSB302 or STUSB4500 for USB PD negotiation (9V/12V input for higher power budget).
- [ ] **DDR routing constraints** — LPDDR4 needs length-matched differential pairs. Add tscircuit constraints or document manual routing rules.
- [ ] **Add more decoupling caps** — BGA256 packages need ~20 decoupling caps each per best practices. Current design has minimal decoupling.
- [ ] **Ethernet magnetics** — RJ45 MagJack modeled as pinrow. Need proper transformer/common-mode choke if using discrete magnetics.
- [ ] **Add thermal relief and ground plane** — 6-layer stackup definition needed for proper impedance control.

## 🟢 Priority: Features
- [ ] **Export Gerbers and send to fab** — Run `npx tsci export --format gerber` and validate output, upload to JLCPCB/PCBWay.
- [ ] **Generate BOM with LCSC part numbers** — Map each component to real LCSC/Digikey parts for assembly.
- [ ] **Add WiFi/BT module** — RTL8723DS or similar for wireless connectivity.
- [ ] **Add onboard QSPI PSRAM** — For FPGA AI inference buffer (ESP-PSRAM64H or similar).
- [ ] **Create GitHub repo and push** — Set up remote, push initial commit.
- [ ] **Board silkscreen and labeling** — Add component labels, board name, version, pin labels on GPIO header.

## 📝 Architecture Notes

### Board Specs
- **Size:** 120mm × 90mm, targeting 6-layer PCB
- **SoC:** AllWinner T527 (8× Cortex-A55, 2TOPS NPU) — BGA256
- **FPGA:** Gowin GW2A-18 (18K LUTs) — BGA256
- **RAM:** LPDDR4 2GB
- **Storage:** eMMC 32GB + MicroSD slot
- **Power:** USB-C → AXP717 PMIC → 0.9V/1.1V/1.2V/1.8V/3.3V rails + 1.0V FPGA core + 5V boost

### Key Files
- `pcb/board.tsx` — Main tscircuit board definition (54 components, 48 nets)
- `pcb/circuit.json` — Generated circuit JSON (gitignored)

### Commands
```bash
bun run pcb/board.tsx              # Generate circuit JSON
npx tsci dev pcb/board.tsx         # Interactive viewer
npx tsci export --format gerber    # Gerber export for fab
npx tsci export --format bom      # Bill of materials
```

### Power Rails
| Rail | Voltage | Source | Feeds |
|------|---------|--------|-------|
| VBUS | 5V USB | USB-C input | PMIC, 5V boost |
| V0V9 | 0.9V | PMIC DCDC1 | SoC core |
| V1V1 | 1.1V | PMIC DCDC2 | SoC CPU, DDR VDD |
| V1V2 | 1.2V | PMIC LDO1 | DDR VDDQ |
| V1V8 | 1.8V | PMIC DCDC3 | SoC IO, FPGA bank 0, eMMC VCCQ |
| V3V3 | 3.3V | PMIC DCDC4 | SoC IO, FPGA bank 1, ETH, SD, flash |
| VFPGA | 1.0V | Dedicated reg | FPGA core |
| V5V | 5.0V | Boost converter | USB host, HDMI |

## ⚠️ Security Reminders
- Don't commit API keys from `index.tsx` to public repos
- `.env` files are gitignored
