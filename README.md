# my-space — AI SoC + FPGA Board

PCB design for an AllWinner T527 + Gowin GW2A-18 AI acceleration board, written in [tscircuit](https://tscircuit.com).

## Board Specs

| Spec | Detail |
|------|--------|
| **SoC** | AllWinner T527 — 8× Cortex-A55, 2 TOPS NPU |
| **FPGA** | Gowin GW2A-18 — 18K LUTs, AI coprocessor |
| **RAM** | LPDDR4 2GB |
| **Storage** | eMMC 32GB + MicroSD |
| **USB** | USB-C power input (5.1k CC), USB 3.0 host |
| **Video** | HDMI output (with TPD12S016 ESD protection) |
| **Camera** | MIPI CSI 2-lane |
| **Network** | Gigabit Ethernet (RTL8211F PHY) |
| **Debug** | UART header, FPGA JTAG header |
| **GPIO** | 40-pin header (SoC + FPGA IOs) |
| **Power** | AXP717 PMIC, 5V boost, FPGA 1.0V regulator |
| **Size** | 120mm × 90mm |
| **Components** | 58 total, 52 nets |

## Architecture

```
USB-C ──→ AXP717 PMIC ──→ 0.9V / 1.1V / 1.2V / 1.8V / 3.3V
                      └──→ 1.0V (FPGA core regulator)
                      └──→ 5.0V (boost for USB host + HDMI)

AllWinner T527 (BGA256)          Gowin GW2A-18 (BGA256)
├── LPDDR4 2GB                   ├── W25Q128 config flash
├── eMMC 32GB                    ├── 50MHz oscillator
├── HDMI → ESD → connector       ├── JTAG header
├── MIPI CSI camera              ├── 8× FPGA IOs → GPIO header
├── RGMII → RTL8211F → RJ45     └── SPI bridge ←→ SoC
├── USB 3.0 host
├── MicroSD
├── UART debug
└── 4× SoC GPIOs → GPIO header
```

## Quick Start

```bash
bun install
bun run pcb/board.tsx    # generate circuit JSON
```

## Export for Fabrication

```bash
# Gerbers (upload to JLCPCB/PCBWay)
npx tscircuit export pcb/board.tsx -f gerbers -o output/gerbers.zip

# PCB layout preview
npx tscircuit export pcb/board.tsx -f pcb-svg -o output/board.svg

# KiCad project (for manual routing)
npx tscircuit export pcb/board.tsx -f kicad_zip -o output/kicad.zip

# Readable netlist
npx tscircuit export pcb/board.tsx -f readable-netlist -o output/netlist.txt
```

## Fab Settings (JLCPCB)

- Layers: 6
- Thickness: 1.6mm
- Surface finish: ENIG
- Copper weight: 1oz
- Min trace/space: 4mil/4mil (BGA fanout)

## Key Files

- `pcb/board.tsx` — Main tscircuit board definition
- `pcb/output/` — Generated fab files (gitignored)

## License

MIT
