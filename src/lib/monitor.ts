export type MonitorFilter = { key: string; label: string; led: string; filter: string }

// The buttons under the 3D monitor turn it into a monochrome phosphor screen. Sepia gives every
// pixel the same hue, which is then rotated to the phosphor's color; gray leaves the screen as is
export const monitorFilters: MonitorFilter[] = [
  { key: 'gray', label: 'Gray', led: '#f2f2f2', filter: 'none' },
  { key: 'green', label: 'Green', led: '#39ff14', filter: 'grayscale(1) sepia(0.45) hue-rotate(75deg) saturate(1.5)' },
  { key: 'blue', label: 'Blue', led: '#4aa8ff', filter: 'grayscale(1) sepia(0.45) hue-rotate(170deg) saturate(1.4)' },
  { key: 'amber', label: 'Amber', led: '#ffb000', filter: 'grayscale(1) sepia(0.45) hue-rotate(-5deg) saturate(1.6)' },
]

export const defaultMonitorFilter = 'gray'

export const monitorFilter = (key: string) => monitorFilters.find((f) => f.key === key) ?? monitorFilters[0]
