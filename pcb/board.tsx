/**
 * AllWinner T527 + Gowin GW2A-18 AI SoC Board
 * 120mm x 90mm, 6-layer PCB
 *
 * Subsystems:
 * 1. Power (AXP717 PMIC, 5V boost, FPGA 1.0V reg)
 * 2. SoC (T527 BGA256 + 24MHz crystal + decoupling)
 * 3. FPGA (GW2A-18 BGA256 + 50MHz osc + config flash + decoupling)
 * 4. Memory (LPDDR4 2GB + eMMC 32GB)
 * 5. Connectivity (USB-C, USB3, GbE, HDMI, MIPI CSI, SD)
 * 6. Debug (UART, JTAG)
 * 7. GPIO (40-pin header with SoC + FPGA IOs)
 * 8. UI (3 LEDs, reset button, FPGA program button)
 */

// @ts-nocheck
/** @jsxImportSource react */
import { Circuit } from "@tscircuit/core"

const circuit = new Circuit()

circuit.add(
  <board width="120mm" height="90mm">

    {/* === POWER: AXP717 PMIC === */}
    <chip name="U_PMIC" footprint="qfn40" pcb_x="-35mm" pcb_y="25mm"
      pin_labels={{ pin1: "VIN", pin2: "GND", pin3: "DCDC1", pin4: "DCDC2",
        pin5: "DCDC3", pin6: "DCDC4", pin7: "LDO1", pin9: "SCL", pin10: "SDA" }} />
    <capacitor name="C1" capacitance="22uF" footprint="0805" pcb_x="-42mm" pcb_y="28mm" />
    <capacitor name="C2" capacitance="100nF" footprint="0402" pcb_x="-40mm" pcb_y="28mm" />
    <capacitor name="C3" capacitance="22uF" footprint="0805" pcb_x="-28mm" pcb_y="28mm" />
    <capacitor name="C4" capacitance="22uF" footprint="0805" pcb_x="-28mm" pcb_y="26mm" />
    <capacitor name="C5" capacitance="10uF" footprint="0805" pcb_x="-28mm" pcb_y="24mm" />
    <capacitor name="C6" capacitance="10uF" footprint="0805" pcb_x="-28mm" pcb_y="22mm" />

    <trace from=".C1 > .pin1" to=".U_PMIC > .VIN" />
    <trace from=".C1 > .pin2" to="net.GND" />
    <trace from=".C2 > .pin1" to=".U_PMIC > .VIN" />
    <trace from=".C2 > .pin2" to="net.GND" />
    <trace from=".U_PMIC > .GND" to="net.GND" />
    <trace from=".U_PMIC > .DCDC1" to="net.V0V9" />
    <trace from=".U_PMIC > .DCDC2" to="net.V1V1" />
    <trace from=".U_PMIC > .DCDC3" to="net.V1V8" />
    <trace from=".U_PMIC > .DCDC4" to="net.V3V3" />
    <trace from=".U_PMIC > .LDO1" to="net.V1V2" />
    <trace from=".C3 > .pin1" to="net.V0V9" />
    <trace from=".C3 > .pin2" to="net.GND" />
    <trace from=".C4 > .pin1" to="net.V1V1" />
    <trace from=".C4 > .pin2" to="net.GND" />
    <trace from=".C5 > .pin1" to="net.V1V8" />
    <trace from=".C5 > .pin2" to="net.GND" />
    <trace from=".C6 > .pin1" to="net.V3V3" />
    <trace from=".C6 > .pin2" to="net.GND" />

    {/* I2C pull-ups for PMIC */}
    <resistor name="R1" resistance="4.7k" footprint="0402" pcb_x="-30mm" pcb_y="18mm" />
    <resistor name="R2" resistance="4.7k" footprint="0402" pcb_x="-28mm" pcb_y="18mm" />
    <trace from=".R1 > .pin1" to="net.V3V3" />
    <trace from=".R1 > .pin2" to=".U_PMIC > .SCL" />
    <trace from=".R2 > .pin1" to="net.V3V3" />
    <trace from=".R2 > .pin2" to=".U_PMIC > .SDA" />

    {/* === FPGA 1.0V Regulator === */}
    <chip name="U_FREG" footprint="sot23" pcb_x="40mm" pcb_y="15mm"
      pin_labels={{ pin1: "VIN", pin2: "GND", pin3: "VOUT" }} />
    <capacitor name="C7" capacitance="10uF" footprint="0805" pcb_x="38mm" pcb_y="18mm" />
    <capacitor name="C8" capacitance="22uF" footprint="0805" pcb_x="43mm" pcb_y="18mm" />
    <trace from=".U_FREG > .VIN" to="net.V3V3" />
    <trace from=".U_FREG > .GND" to="net.GND" />
    <trace from=".U_FREG > .VOUT" to="net.VFPGA" />
    <trace from=".C7 > .pin1" to="net.V3V3" />
    <trace from=".C7 > .pin2" to="net.GND" />
    <trace from=".C8 > .pin1" to="net.VFPGA" />
    <trace from=".C8 > .pin2" to="net.GND" />

    {/* === 5V Boost for USB Host === */}
    <chip name="U_BOOST" footprint="sot23" pcb_x="45mm" pcb_y="30mm"
      pin_labels={{ pin1: "VIN", pin2: "GND", pin3: "VOUT" }} />
    <trace from=".U_BOOST > .VIN" to="net.VBUS" />
    <trace from=".U_BOOST > .GND" to="net.GND" />
    <trace from=".U_BOOST > .VOUT" to="net.V5V" />

    {/* === ALLWINNER T527 SoC === */}
    <chip name="U_SOC" footprint="bga256" pcb_x="-10mm" pcb_y="5mm"
      pin_labels={{
        pin1: "VCORE", pin2: "VCPU", pin3: "VIO18", pin4: "VIO33", pin5: "GND",
        pin10: "DDR_D0", pin11: "DDR_D1", pin12: "DDR_D2", pin13: "DDR_D3",
        pin14: "DDR_D4", pin15: "DDR_D5", pin16: "DDR_D6", pin17: "DDR_D7",
        pin18: "DDR_DQS", pin19: "DDR_CLK", pin20: "DDR_CS",
        pin30: "MMC_CMD", pin31: "MMC_CLK", pin32: "MMC_D0", pin33: "MMC_D1",
        pin34: "MMC_D2", pin35: "MMC_D3", pin36: "MMC_D4", pin37: "MMC_D5",
        pin38: "MMC_D6", pin39: "MMC_D7",
        pin45: "SD_CMD", pin46: "SD_CLK", pin47: "SD_D0", pin48: "SD_D1",
        pin49: "SD_D2", pin50: "SD_D3",
        pin55: "USB_DP", pin56: "USB_DN",
        pin57: "SS_TXP", pin58: "SS_TXN", pin59: "SS_RXP", pin60: "SS_RXN",
        pin65: "ETX0", pin66: "ETX1", pin67: "ETX2", pin68: "ETX3",
        pin69: "ETXCK", pin70: "ETXEN",
        pin71: "ERX0", pin72: "ERX1", pin73: "ERX2", pin74: "ERX3",
        pin75: "ERXCK", pin76: "ERXDV", pin77: "EMDC", pin78: "EMDIO",
        pin80: "HTXP0", pin81: "HTXN0", pin82: "HTXP1", pin83: "HTXN1",
        pin84: "HTXP2", pin85: "HTXN2", pin86: "HTXCP", pin87: "HTXCN",
        pin88: "HSCL", pin89: "HSDA", pin90: "HCEC", pin91: "HHPD",
        pin95: "CD0P", pin96: "CD0N", pin97: "CD1P", pin98: "CD1N",
        pin99: "CCKP", pin100: "CCKN",
        pin105: "SPI_CK", pin106: "SPI_MO", pin107: "SPI_MI", pin108: "SPI_CS",
        pin110: "SCL0", pin111: "SDA0",
        pin115: "TX0", pin116: "RX0",
        pin120: "PA0", pin121: "PA1", pin122: "PA2", pin123: "PA3",
        pin140: "NRST", pin145: "XIN", pin146: "XOUT",
      }} />

    <trace from=".U_SOC > .VCORE" to="net.V0V9" />
    <trace from=".U_SOC > .VCPU" to="net.V1V1" />
    <trace from=".U_SOC > .VIO18" to="net.V1V8" />
    <trace from=".U_SOC > .VIO33" to="net.V3V3" />
    <trace from=".U_SOC > .GND" to="net.GND" />
    <trace from=".U_SOC > .SCL0" to=".U_PMIC > .SCL" />
    <trace from=".U_SOC > .SDA0" to=".U_PMIC > .SDA" />

    {/* SoC decoupling */}
    <capacitor name="C10" capacitance="100nF" footprint="0402" pcb_x="-5mm" pcb_y="12mm" />
    <capacitor name="C11" capacitance="100nF" footprint="0402" pcb_x="-3mm" pcb_y="12mm" />
    <capacitor name="C12" capacitance="4.7uF" footprint="0805" pcb_x="-1mm" pcb_y="12mm" />
    <trace from=".C10 > .pin1" to="net.V0V9" />
    <trace from=".C10 > .pin2" to="net.GND" />
    <trace from=".C11 > .pin1" to="net.V1V8" />
    <trace from=".C11 > .pin2" to="net.GND" />
    <trace from=".C12 > .pin1" to="net.V3V3" />
    <trace from=".C12 > .pin2" to="net.GND" />

    {/* 24MHz Crystal */}
    <capacitor name="CX1" capacitance="18pF" footprint="0402" pcb_x="-17mm" pcb_y="14mm" />
    <capacitor name="CX2" capacitance="18pF" footprint="0402" pcb_x="-13mm" pcb_y="14mm" />

    {/* === GOWIN GW2A-18 FPGA === */}
    <chip name="U_FPGA" footprint="bga256" pcb_x="30mm" pcb_y="5mm"
      pin_labels={{
        pin1: "VINT", pin2: "VB0", pin3: "VB1", pin4: "GND",
        pin10: "SPI_CK", pin11: "SPI_MO", pin12: "SPI_MI", pin13: "SPI_CS",
        pin15: "CFG_CK", pin16: "CFG_MO", pin17: "CFG_MI", pin18: "CFG_CS",
        pin20: "TCK", pin21: "TDI", pin22: "TDO", pin23: "TMS",
        pin25: "CLKIN",
        pin30: "FA0", pin31: "FA1", pin32: "FA2", pin33: "FA3",
        pin34: "FA4", pin35: "FA5", pin36: "FA6", pin37: "FA7",
        pin55: "DONE", pin56: "INITN", pin57: "PROGN",
      }} />

    <trace from=".U_FPGA > .VINT" to="net.VFPGA" />
    <trace from=".U_FPGA > .VB0" to="net.V1V8" />
    <trace from=".U_FPGA > .VB1" to="net.V3V3" />
    <trace from=".U_FPGA > .GND" to="net.GND" />

    {/* FPGA decoupling */}
    <capacitor name="CF1" capacitance="100nF" footprint="0402" pcb_x="25mm" pcb_y="12mm" />
    <capacitor name="CF2" capacitance="100nF" footprint="0402" pcb_x="27mm" pcb_y="12mm" />
    <capacitor name="CF3" capacitance="4.7uF" footprint="0805" pcb_x="35mm" pcb_y="12mm" />
    <trace from=".CF1 > .pin1" to="net.VFPGA" />
    <trace from=".CF1 > .pin2" to="net.GND" />
    <trace from=".CF2 > .pin1" to="net.V1V8" />
    <trace from=".CF2 > .pin2" to="net.GND" />
    <trace from=".CF3 > .pin1" to="net.VFPGA" />
    <trace from=".CF3 > .pin2" to="net.GND" />

    {/* SPI bridge: SoC <-> FPGA */}
    <trace from=".U_SOC > .SPI_CK" to=".U_FPGA > .SPI_CK" />
    <trace from=".U_SOC > .SPI_MO" to=".U_FPGA > .SPI_MO" />
    <trace from=".U_SOC > .SPI_MI" to=".U_FPGA > .SPI_MI" />
    <trace from=".U_SOC > .SPI_CS" to=".U_FPGA > .SPI_CS" />

    {/* FPGA Config Flash (W25Q128) */}
    <chip name="U_FLASH" footprint="soic8" pcb_x="40mm" pcb_y="-5mm"
      pin_labels={{ pin1: "CS", pin2: "DO", pin3: "WP", pin4: "GND",
        pin5: "DI", pin6: "CLK", pin7: "HOLD", pin8: "VCC" }} />
    <trace from=".U_FLASH > .VCC" to="net.V3V3" />
    <trace from=".U_FLASH > .GND" to="net.GND" />
    <trace from=".U_FLASH > .WP" to="net.V3V3" />
    <trace from=".U_FLASH > .HOLD" to="net.V3V3" />
    <trace from=".U_FLASH > .CS" to=".U_FPGA > .CFG_CS" />
    <trace from=".U_FLASH > .CLK" to=".U_FPGA > .CFG_CK" />
    <trace from=".U_FLASH > .DI" to=".U_FPGA > .CFG_MO" />
    <trace from=".U_FLASH > .DO" to=".U_FPGA > .CFG_MI" />
    <capacitor name="CF4" capacitance="100nF" footprint="0402" pcb_x="45mm" pcb_y="-3mm" />
    <trace from=".CF4 > .pin1" to="net.V3V3" />
    <trace from=".CF4 > .pin2" to="net.GND" />

    {/* === LPDDR4 2GB RAM === */}
    <chip name="U_RAM" footprint="bga200" pcb_x="-10mm" pcb_y="-15mm"
      pin_labels={{
        pin1: "VDD1", pin2: "VDD2", pin3: "VDDQ", pin4: "VSS",
        pin5: "DQ0", pin6: "DQ1", pin7: "DQ2", pin8: "DQ3",
        pin9: "DQ4", pin10: "DQ5", pin11: "DQ6", pin12: "DQ7",
        pin13: "DQS", pin14: "CK", pin15: "CS",
      }} />
    <trace from=".U_RAM > .VDD1" to="net.V1V1" />
    <trace from=".U_RAM > .VDD2" to="net.V1V1" />
    <trace from=".U_RAM > .VDDQ" to="net.V1V2" />
    <trace from=".U_RAM > .VSS" to="net.GND" />
    <trace from=".U_RAM > .DQ0" to=".U_SOC > .DDR_D0" />
    <trace from=".U_RAM > .DQ1" to=".U_SOC > .DDR_D1" />
    <trace from=".U_RAM > .DQ2" to=".U_SOC > .DDR_D2" />
    <trace from=".U_RAM > .DQ3" to=".U_SOC > .DDR_D3" />
    <trace from=".U_RAM > .DQ4" to=".U_SOC > .DDR_D4" />
    <trace from=".U_RAM > .DQ5" to=".U_SOC > .DDR_D5" />
    <trace from=".U_RAM > .DQ6" to=".U_SOC > .DDR_D6" />
    <trace from=".U_RAM > .DQ7" to=".U_SOC > .DDR_D7" />
    <trace from=".U_RAM > .DQS" to=".U_SOC > .DDR_DQS" />
    <trace from=".U_RAM > .CK" to=".U_SOC > .DDR_CLK" />
    <trace from=".U_RAM > .CS" to=".U_SOC > .DDR_CS" />
    <capacitor name="CR1" capacitance="100nF" footprint="0402" pcb_x="-5mm" pcb_y="-10mm" />
    <capacitor name="CR2" capacitance="4.7uF" footprint="0805" pcb_x="-3mm" pcb_y="-10mm" />
    <trace from=".CR1 > .pin1" to="net.V1V1" />
    <trace from=".CR1 > .pin2" to="net.GND" />
    <trace from=".CR2 > .pin1" to="net.V1V2" />
    <trace from=".CR2 > .pin2" to="net.GND" />

    {/* === eMMC 32GB === */}
    <chip name="U_EMMC" footprint="bga153" pcb_x="15mm" pcb_y="-15mm"
      pin_labels={{
        pin1: "VCC", pin2: "VCCQ", pin3: "VSS",
        pin4: "CMD", pin5: "CLK",
        pin6: "D0", pin7: "D1", pin8: "D2", pin9: "D3",
        pin10: "D4", pin11: "D5", pin12: "D6", pin13: "D7",
      }} />
    <trace from=".U_EMMC > .VCC" to="net.V3V3" />
    <trace from=".U_EMMC > .VCCQ" to="net.V1V8" />
    <trace from=".U_EMMC > .VSS" to="net.GND" />
    <trace from=".U_EMMC > .CMD" to=".U_SOC > .MMC_CMD" />
    <trace from=".U_EMMC > .CLK" to=".U_SOC > .MMC_CLK" />
    <trace from=".U_EMMC > .D0" to=".U_SOC > .MMC_D0" />
    <trace from=".U_EMMC > .D1" to=".U_SOC > .MMC_D1" />
    <trace from=".U_EMMC > .D2" to=".U_SOC > .MMC_D2" />
    <trace from=".U_EMMC > .D3" to=".U_SOC > .MMC_D3" />
    <trace from=".U_EMMC > .D4" to=".U_SOC > .MMC_D4" />
    <trace from=".U_EMMC > .D5" to=".U_SOC > .MMC_D5" />
    <trace from=".U_EMMC > .D6" to=".U_SOC > .MMC_D6" />
    <trace from=".U_EMMC > .D7" to=".U_SOC > .MMC_D7" />

    {/* === USB-C Power Input === */}
    <chip name="J_USBC" footprint="pinrow8" pcb_x="-50mm" pcb_y="35mm"
      pin_labels={{ pin1: "GND", pin2: "VBUS", pin3: "CC1", pin4: "CC2",
        pin5: "DP", pin6: "DN", pin7: "SBU1", pin8: "SBU2" }} />
    {/* USB-C CC pull-downs: 5.1k to GND = advertise as UFP sink, request 5V */}
    <resistor name="R_CC1" resistance="5.1k" footprint="0402" pcb_x="-48mm" pcb_y="32mm" />
    <resistor name="R_CC2" resistance="5.1k" footprint="0402" pcb_x="-46mm" pcb_y="32mm" />
    <trace from=".R_CC1 > .pin1" to=".J_USBC > .CC1" />
    <trace from=".R_CC1 > .pin2" to="net.GND" />
    <trace from=".R_CC2 > .pin1" to=".J_USBC > .CC2" />
    <trace from=".R_CC2 > .pin2" to="net.GND" />
    {/* VBUS input protection: schottky + TVS would go here in real design */}
    <trace from=".J_USBC > .VBUS" to=".U_PMIC > .VIN" />
    <trace from=".J_USBC > .VBUS" to="net.VBUS" />
    <trace from=".J_USBC > .GND" to="net.GND" />

    {/* === USB 3.0 Host === */}
    <chip name="J_USB3" footprint="pinrow9" pcb_x="50mm" pcb_y="35mm"
      pin_labels={{ pin1: "VBUS", pin2: "DN", pin3: "DP", pin4: "GND",
        pin5: "SSRXN", pin6: "SSRXP", pin7: "SGND", pin8: "SSTXN", pin9: "SSTXP" }} />
    <trace from=".J_USB3 > .VBUS" to="net.V5V" />
    <trace from=".J_USB3 > .GND" to="net.GND" />
    <trace from=".J_USB3 > .SGND" to="net.GND" />
    <trace from=".J_USB3 > .DP" to=".U_SOC > .USB_DP" />
    <trace from=".J_USB3 > .DN" to=".U_SOC > .USB_DN" />
    <trace from=".J_USB3 > .SSTXP" to=".U_SOC > .SS_TXP" />
    <trace from=".J_USB3 > .SSTXN" to=".U_SOC > .SS_TXN" />
    <trace from=".J_USB3 > .SSRXP" to=".U_SOC > .SS_RXP" />
    <trace from=".J_USB3 > .SSRXN" to=".U_SOC > .SS_RXN" />

    {/* === GbE PHY (RTL8211F) === */}
    <chip name="U_ETH" footprint="qfn48" pcb_x="50mm" pcb_y="-15mm"
      pin_labels={{
        pin1: "AVDD", pin2: "DVDD", pin3: "GND",
        pin4: "TXD0", pin5: "TXD1", pin6: "TXD2", pin7: "TXD3",
        pin8: "TXCLK", pin9: "TXEN",
        pin10: "RXD0", pin11: "RXD1", pin12: "RXD2", pin13: "RXD3",
        pin14: "RXCLK", pin15: "RXDV", pin16: "MDC", pin17: "MDIO",
        pin18: "TXP", pin19: "TXN", pin20: "RXP", pin21: "RXN",
        pin24: "RESET",
      }} />
    <trace from=".U_ETH > .AVDD" to="net.V3V3" />
    <trace from=".U_ETH > .DVDD" to="net.V3V3" />
    <trace from=".U_ETH > .GND" to="net.GND" />
    <trace from=".U_ETH > .TXD0" to=".U_SOC > .ETX0" />
    <trace from=".U_ETH > .TXD1" to=".U_SOC > .ETX1" />
    <trace from=".U_ETH > .TXD2" to=".U_SOC > .ETX2" />
    <trace from=".U_ETH > .TXD3" to=".U_SOC > .ETX3" />
    <trace from=".U_ETH > .TXCLK" to=".U_SOC > .ETXCK" />
    <trace from=".U_ETH > .TXEN" to=".U_SOC > .ETXEN" />
    <trace from=".U_ETH > .RXD0" to=".U_SOC > .ERX0" />
    <trace from=".U_ETH > .RXD1" to=".U_SOC > .ERX1" />
    <trace from=".U_ETH > .RXD2" to=".U_SOC > .ERX2" />
    <trace from=".U_ETH > .RXD3" to=".U_SOC > .ERX3" />
    <trace from=".U_ETH > .RXCLK" to=".U_SOC > .ERXCK" />
    <trace from=".U_ETH > .RXDV" to=".U_SOC > .ERXDV" />
    <trace from=".U_ETH > .MDC" to=".U_SOC > .EMDC" />
    <trace from=".U_ETH > .MDIO" to=".U_SOC > .EMDIO" />

    <resistor name="R_ERST" resistance="10k" footprint="0402" pcb_x="47mm" pcb_y="-20mm" />
    <trace from=".R_ERST > .pin1" to="net.V3V3" />
    <trace from=".R_ERST > .pin2" to=".U_ETH > .RESET" />

    {/* RJ45 MagJack */}
    <chip name="J_RJ45" footprint="pinrow8" pcb_x="55mm" pcb_y="-25mm"
      pin_labels={{ pin1: "TXP", pin2: "TXN", pin3: "RXP", pin4: "RXN",
        pin5: "LEDG", pin6: "LEDY", pin7: "GND", pin8: "VCC" }} />
    <trace from=".J_RJ45 > .TXP" to=".U_ETH > .TXP" />
    <trace from=".J_RJ45 > .TXN" to=".U_ETH > .TXN" />
    <trace from=".J_RJ45 > .RXP" to=".U_ETH > .RXP" />
    <trace from=".J_RJ45 > .RXN" to=".U_ETH > .RXN" />
    <trace from=".J_RJ45 > .GND" to="net.GND" />
    <trace from=".J_RJ45 > .VCC" to="net.V3V3" />

    {/* === HDMI === */}
    {/* ESD protection: TPD12S016 (models as chip with pass-through + ESD clamp) */}
    <chip name="U_HDMI_ESD" footprint="qfn24" pcb_x="45mm" pcb_y="18mm"
      pin_labels={{
        pin1: "VCC5V", pin2: "GND",
        pin3: "IN_D2P", pin4: "IN_D2N", pin5: "IN_D1P", pin6: "IN_D1N",
        pin7: "IN_D0P", pin8: "IN_D0N", pin9: "IN_CKP", pin10: "IN_CKN",
        pin11: "OUT_D2P", pin12: "OUT_D2N", pin13: "OUT_D1P", pin14: "OUT_D1N",
        pin15: "OUT_D0P", pin16: "OUT_D0N", pin17: "OUT_CKP", pin18: "OUT_CKN",
        pin19: "CEC", pin20: "SCL", pin21: "SDA", pin22: "HPD",
        pin23: "CT_HPD", pin24: "LS_OE",
      }} />
    <trace from=".U_HDMI_ESD > .VCC5V" to="net.V5V" />
    <trace from=".U_HDMI_ESD > .GND" to="net.GND" />
    <trace from=".U_HDMI_ESD > .LS_OE" to="net.V3V3" />
    <capacitor name="C_HESD" capacitance="100nF" footprint="0402" pcb_x="48mm" pcb_y="20mm" />
    <trace from=".C_HESD > .pin1" to="net.V5V" />
    <trace from=".C_HESD > .pin2" to="net.GND" />

    {/* SoC -> ESD chip (input side) */}
    <trace from=".U_SOC > .HTXP2" to=".U_HDMI_ESD > .IN_D2P" />
    <trace from=".U_SOC > .HTXN2" to=".U_HDMI_ESD > .IN_D2N" />
    <trace from=".U_SOC > .HTXP1" to=".U_HDMI_ESD > .IN_D1P" />
    <trace from=".U_SOC > .HTXN1" to=".U_HDMI_ESD > .IN_D1N" />
    <trace from=".U_SOC > .HTXP0" to=".U_HDMI_ESD > .IN_D0P" />
    <trace from=".U_SOC > .HTXN0" to=".U_HDMI_ESD > .IN_D0N" />
    <trace from=".U_SOC > .HTXCP" to=".U_HDMI_ESD > .IN_CKP" />
    <trace from=".U_SOC > .HTXCN" to=".U_HDMI_ESD > .IN_CKN" />
    <trace from=".U_SOC > .HCEC" to=".U_HDMI_ESD > .CEC" />
    <trace from=".U_SOC > .HSCL" to=".U_HDMI_ESD > .SCL" />
    <trace from=".U_SOC > .HSDA" to=".U_HDMI_ESD > .SDA" />
    <trace from=".U_SOC > .HHPD" to=".U_HDMI_ESD > .CT_HPD" />

    {/* ESD chip -> HDMI connector (output side) */}
    <chip name="J_HDMI" footprint="pinrow14" pcb_x="55mm" pcb_y="15mm"
      pin_labels={{ pin1: "D2P", pin2: "D2N", pin3: "D1P", pin4: "D1N",
        pin5: "D0P", pin6: "D0N", pin7: "CKP", pin8: "CKN",
        pin9: "CEC", pin10: "SCL", pin11: "SDA", pin12: "HPD",
        pin13: "V5V", pin14: "GND" }} />
    <trace from=".U_HDMI_ESD > .OUT_D2P" to=".J_HDMI > .D2P" />
    <trace from=".U_HDMI_ESD > .OUT_D2N" to=".J_HDMI > .D2N" />
    <trace from=".U_HDMI_ESD > .OUT_D1P" to=".J_HDMI > .D1P" />
    <trace from=".U_HDMI_ESD > .OUT_D1N" to=".J_HDMI > .D1N" />
    <trace from=".U_HDMI_ESD > .OUT_D0P" to=".J_HDMI > .D0P" />
    <trace from=".U_HDMI_ESD > .OUT_D0N" to=".J_HDMI > .D0N" />
    <trace from=".U_HDMI_ESD > .OUT_CKP" to=".J_HDMI > .CKP" />
    <trace from=".U_HDMI_ESD > .OUT_CKN" to=".J_HDMI > .CKN" />
    <trace from=".U_HDMI_ESD > .HPD" to=".J_HDMI > .HPD" />
    <trace from=".J_HDMI > .V5V" to="net.V5V" />
    <trace from=".J_HDMI > .GND" to="net.GND" />

    {/* === MIPI CSI Camera === */}
    <chip name="J_CSI" footprint="pinrow10" pcb_x="-50mm" pcb_y="10mm"
      pin_labels={{ pin1: "GND1", pin2: "D0N", pin3: "D0P", pin4: "GND2",
        pin5: "D1N", pin6: "D1P", pin7: "GND3", pin8: "CKN", pin9: "CKP",
        pin10: "VCC" }} />
    <trace from=".J_CSI > .GND1" to="net.GND" />
    <trace from=".J_CSI > .GND2" to="net.GND" />
    <trace from=".J_CSI > .GND3" to="net.GND" />
    <trace from=".J_CSI > .VCC" to="net.V3V3" />
    <trace from=".J_CSI > .D0P" to=".U_SOC > .CD0P" />
    <trace from=".J_CSI > .D0N" to=".U_SOC > .CD0N" />
    <trace from=".J_CSI > .D1P" to=".U_SOC > .CD1P" />
    <trace from=".J_CSI > .D1N" to=".U_SOC > .CD1N" />
    <trace from=".J_CSI > .CKP" to=".U_SOC > .CCKP" />
    <trace from=".J_CSI > .CKN" to=".U_SOC > .CCKN" />

    {/* === MicroSD === */}
    <chip name="J_SD" footprint="pinrow9" pcb_x="-50mm" pcb_y="-10mm"
      pin_labels={{ pin1: "D2", pin2: "D3", pin3: "CMD", pin4: "VCC",
        pin5: "CLK", pin6: "GND", pin7: "D0", pin8: "D1", pin9: "DET" }} />
    <trace from=".J_SD > .VCC" to="net.V3V3" />
    <trace from=".J_SD > .GND" to="net.GND" />
    <trace from=".J_SD > .CMD" to=".U_SOC > .SD_CMD" />
    <trace from=".J_SD > .CLK" to=".U_SOC > .SD_CLK" />
    <trace from=".J_SD > .D0" to=".U_SOC > .SD_D0" />
    <trace from=".J_SD > .D1" to=".U_SOC > .SD_D1" />
    <trace from=".J_SD > .D2" to=".U_SOC > .SD_D2" />
    <trace from=".J_SD > .D3" to=".U_SOC > .SD_D3" />

    {/* === UART Debug Header === */}
    <chip name="J_UART" footprint="pinrow4" pcb_x="-50mm" pcb_y="-30mm"
      pin_labels={{ pin1: "VCC", pin2: "TX", pin3: "RX", pin4: "GND" }} />
    <trace from=".J_UART > .VCC" to="net.V3V3" />
    <trace from=".J_UART > .GND" to="net.GND" />
    <trace from=".J_UART > .TX" to=".U_SOC > .TX0" />
    <trace from=".J_UART > .RX" to=".U_SOC > .RX0" />

    {/* === FPGA JTAG Header === */}
    <chip name="J_JTAG" footprint="pinrow6" pcb_x="50mm" pcb_y="-35mm"
      pin_labels={{ pin1: "VCC", pin2: "GND", pin3: "TCK", pin4: "TDI",
        pin5: "TDO", pin6: "TMS" }} />
    <trace from=".J_JTAG > .VCC" to="net.V3V3" />
    <trace from=".J_JTAG > .GND" to="net.GND" />
    <trace from=".J_JTAG > .TCK" to=".U_FPGA > .TCK" />
    <trace from=".J_JTAG > .TDI" to=".U_FPGA > .TDI" />
    <trace from=".J_JTAG > .TDO" to=".U_FPGA > .TDO" />
    <trace from=".J_JTAG > .TMS" to=".U_FPGA > .TMS" />

    <resistor name="R_TCK" resistance="10k" footprint="0402" pcb_x="45mm" pcb_y="-32mm" />
    <resistor name="R_TMS" resistance="10k" footprint="0402" pcb_x="45mm" pcb_y="-34mm" />
    <trace from=".R_TCK > .pin1" to="net.V3V3" />
    <trace from=".R_TCK > .pin2" to=".U_FPGA > .TCK" />
    <trace from=".R_TMS > .pin1" to="net.V3V3" />
    <trace from=".R_TMS > .pin2" to=".U_FPGA > .TMS" />

    {/* === 40-pin GPIO Header === */}
    <chip name="J_GPIO" footprint="pinrow40" pcb_x="0mm" pcb_y="-35mm"
      pin_labels={{
        pin1: "P3V3", pin2: "P5V", pin3: "SDA", pin4: "P5V2",
        pin5: "SCL", pin6: "PGND",
        pin7: "GA0", pin8: "UTX", pin9: "PGND2", pin10: "URX",
        pin11: "GA1", pin12: "GA2", pin13: "GA3", pin14: "PGND3",
        pin15: "FA0", pin16: "FA1", pin17: "P3V32",
        pin18: "FA2", pin19: "FA3", pin20: "PGND4",
        pin21: "FA4", pin22: "FA5", pin23: "FA6", pin24: "FA7",
        pin25: "PGND5",
      }} />
    <trace from=".J_GPIO > .P3V3" to="net.V3V3" />
    <trace from=".J_GPIO > .P3V32" to="net.V3V3" />
    <trace from=".J_GPIO > .P5V" to="net.V5V" />
    <trace from=".J_GPIO > .P5V2" to="net.V5V" />
    <trace from=".J_GPIO > .PGND" to="net.GND" />
    <trace from=".J_GPIO > .PGND2" to="net.GND" />
    <trace from=".J_GPIO > .PGND3" to="net.GND" />
    <trace from=".J_GPIO > .PGND4" to="net.GND" />
    <trace from=".J_GPIO > .PGND5" to="net.GND" />
    <trace from=".J_GPIO > .GA0" to=".U_SOC > .PA0" />
    <trace from=".J_GPIO > .GA1" to=".U_SOC > .PA1" />
    <trace from=".J_GPIO > .GA2" to=".U_SOC > .PA2" />
    <trace from=".J_GPIO > .GA3" to=".U_SOC > .PA3" />
    <trace from=".J_GPIO > .FA0" to=".U_FPGA > .FA0" />
    <trace from=".J_GPIO > .FA1" to=".U_FPGA > .FA1" />
    <trace from=".J_GPIO > .FA2" to=".U_FPGA > .FA2" />
    <trace from=".J_GPIO > .FA3" to=".U_FPGA > .FA3" />
    <trace from=".J_GPIO > .FA4" to=".U_FPGA > .FA4" />
    <trace from=".J_GPIO > .FA5" to=".U_FPGA > .FA5" />
    <trace from=".J_GPIO > .FA6" to=".U_FPGA > .FA6" />
    <trace from=".J_GPIO > .FA7" to=".U_FPGA > .FA7" />

    {/* === LEDs === */}
    <led name="LED1" footprint="0603" color="green" pcb_x="-45mm" pcb_y="-25mm" />
    <resistor name="RL1" resistance="1k" footprint="0402" pcb_x="-43mm" pcb_y="-25mm" />
    <trace from=".LED1 > .pos" to=".RL1 > .pin1" />
    <trace from=".RL1 > .pin2" to="net.V3V3" />
    <trace from=".LED1 > .neg" to="net.GND" />

    <led name="LED2" footprint="0603" color="blue" pcb_x="-45mm" pcb_y="-28mm" />
    <resistor name="RL2" resistance="1k" footprint="0402" pcb_x="-43mm" pcb_y="-28mm" />
    <trace from=".LED2 > .pos" to=".RL2 > .pin1" />
    <trace from=".RL2 > .pin2" to=".U_SOC > .PA0" />
    <trace from=".LED2 > .neg" to="net.GND" />

    <led name="LED3" footprint="0603" color="red" pcb_x="-45mm" pcb_y="-31mm" />
    <resistor name="RL3" resistance="1k" footprint="0402" pcb_x="-43mm" pcb_y="-31mm" />
    <trace from=".LED3 > .pos" to=".RL3 > .pin1" />
    <trace from=".RL3 > .pin2" to=".U_FPGA > .DONE" />
    <trace from=".LED3 > .neg" to="net.GND" />

    {/* === Reset Button === */}
    <chip name="SW1" footprint="pushbutton" pcb_x="-45mm" pcb_y="-38mm"
      pin_labels={{ pin1: "A", pin2: "B" }} />
    <resistor name="R_RST" resistance="10k" footprint="0402" pcb_x="-40mm" pcb_y="-38mm" />
    <capacitor name="C_RST" capacitance="100nF" footprint="0402" pcb_x="-40mm" pcb_y="-40mm" />
    <trace from=".SW1 > .A" to="net.GND" />
    <trace from=".SW1 > .B" to=".U_SOC > .NRST" />
    <trace from=".R_RST > .pin1" to="net.V3V3" />
    <trace from=".R_RST > .pin2" to=".U_SOC > .NRST" />
    <trace from=".C_RST > .pin1" to=".U_SOC > .NRST" />
    <trace from=".C_RST > .pin2" to="net.GND" />

    {/* === FPGA Program Button === */}
    <chip name="SW2" footprint="pushbutton" pcb_x="40mm" pcb_y="-38mm"
      pin_labels={{ pin1: "A", pin2: "B" }} />
    <resistor name="R_PROG" resistance="10k" footprint="0402" pcb_x="37mm" pcb_y="-38mm" />
    <trace from=".SW2 > .A" to="net.GND" />
    <trace from=".SW2 > .B" to=".U_FPGA > .PROGN" />
    <trace from=".R_PROG > .pin1" to="net.V3V3" />
    <trace from=".R_PROG > .pin2" to=".U_FPGA > .PROGN" />

    <resistor name="R_INIT" resistance="10k" footprint="0402" pcb_x="37mm" pcb_y="-40mm" />
    <trace from=".R_INIT > .pin1" to="net.V3V3" />
    <trace from=".R_INIT > .pin2" to=".U_FPGA > .INITN" />

  </board>
)

const circuitJson = circuit.getCircuitJson()

await Bun.write("pcb/circuit.json", JSON.stringify(circuitJson, null, 2))

const components = circuitJson.filter((e: any) => e.type === "source_component").length
const traces = circuitJson.filter((e: any) => e.type === "source_trace").length
const errors = circuitJson.filter((e: any) => e.type === "source_failed_to_create_component_error")

console.log("✅ Circuit JSON generated: pcb/circuit.json")
console.log(`   Components: ${components}`)
console.log(`   Traces: ${traces}`)
if (errors.length > 0) {
  console.log(`   ⚠️  Errors: ${errors.length}`)
  errors.forEach((e: any) => console.log(`      - ${e.component_name}: ${e.message.split("Details")[0].trim()}`))
}
console.log("")
console.log("Board: AllWinner T527 + Gowin GW2A-18 | 120x90mm")
console.log("")
console.log("Next steps:")
console.log("  View:    npx tsci dev pcb/board.tsx")
console.log("  Gerbers: npx tsci export --format gerber --output pcb/gerbers/")
console.log("  BOM:     npx tsci export --format bom --output pcb/bom.csv")
