export interface WallpaperPreset {
  id: string
  name: string
  icon: string
  desc: string
  url: string
  type: 'image' | 'gradient'
}

export interface AccentColorPreset {
  id: string
  name: string
  hsl: string
  hex: string
}

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  {
    id: 'clean-slate',
    name: 'Clean Slate',
    icon: '⬛',
    desc: 'สีพื้นเรียบหรู ดำ/เทาเข้มแบบมินิมอล ไม่รบกวนสายตา',
    url: '',
    type: 'gradient'
  },
  {
    id: 'cozy-rain',
    name: 'Cozy Anime Rain',
    icon: '🌧️',
    desc: 'บรรยากาศหน้าต่างห้องนอนฝนตก สไตล์ Lo-fi ชวนผ่อนคลาย',
    url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1920&q=80',
    type: 'image'
  },
  {
    id: 'midnight-library',
    name: 'Midnight Library',
    icon: '📚',
    desc: 'บรรยากาศโต๊ะไม้ในห้องสมุดยุคเก่า สมาธิเงียบสงบ',
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1920&q=80',
    type: 'image'
  },
  {
    id: 'minimal-cyberpunk',
    name: 'Minimal Cyberpunk',
    icon: '🌆',
    desc: 'ไล่เฉดสีนีออนเข้มขรึม ไซเบอร์สเปซยามค่ำคืน',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1920&q=80',
    type: 'image'
  }
]

export const ACCENT_PRESETS: AccentColorPreset[] = [
  { id: 'violet', name: 'Cyber Violet', hsl: '258 90% 72%', hex: '#a855f7' },
  { id: 'emerald', name: 'Emerald Green', hsl: '152 60% 55%', hex: '#10b981' },
  { id: 'sky', name: 'Sky Blue', hsl: '199 89% 55%', hex: '#0ea5e9' },
  { id: 'sunset', name: 'Sunset Orange', hsl: '24 95% 58%', hex: '#f97316' },
  { id: 'rose', name: 'Neon Rose', hsl: '350 89% 65%', hex: '#f43f5e' },
  { id: 'amber', name: 'Amber Gold', hsl: '38 92% 55%', hex: '#f59e0b' },
]

export interface ThemeSettings {
  wallpaperId: string
  customWallpaperUrl: string
  dimmer: number // 0 to 90 (percent)
  accentId: string
}

const DEFAULT_THEME: ThemeSettings = {
  wallpaperId: 'clean-slate',
  customWallpaperUrl: '',
  dimmer: 50,
  accentId: 'violet'
}

export function useTheme() {
  const theme = useLocalStorage<ThemeSettings>('noswitch:theme:v2', DEFAULT_THEME)

  const activeWallpaper = computed(() => {
    if (theme.value.customWallpaperUrl) {
      return {
        id: 'custom',
        name: 'Custom Wallpaper',
        icon: '🖼️',
        desc: 'รูปภาพที่กำหนดเอง',
        url: theme.value.customWallpaperUrl,
        type: 'image' as const
      }
    }
    return WALLPAPER_PRESETS.find(w => w.id === theme.value.wallpaperId) || WALLPAPER_PRESETS[0]!
  })

  const activeAccent = computed(() => {
    return ACCENT_PRESETS.find(a => a.id === theme.value.accentId) || ACCENT_PRESETS[0]!
  })

  function setWallpaper(id: string) {
    theme.value.wallpaperId = id
    theme.value.customWallpaperUrl = ''
  }

  function setCustomWallpaper(url: string) {
    theme.value.customWallpaperUrl = url
  }

  function setAccent(accentId: string) {
    theme.value.accentId = accentId
  }

  function setDimmer(value: number) {
    theme.value.dimmer = Math.max(0, Math.min(95, value))
  }

  function resetTheme() {
    theme.value = { ...DEFAULT_THEME }
  }

  return {
    theme,
    activeWallpaper,
    activeAccent,
    setWallpaper,
    setCustomWallpaper,
    setAccent,
    setDimmer,
    resetTheme,
    WALLPAPER_PRESETS,
    ACCENT_PRESETS
  }
}
