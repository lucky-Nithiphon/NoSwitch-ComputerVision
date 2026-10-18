<template>
  <div class="widget flex flex-col h-full w-full select-none" aria-labelledby="theme-customizer-title">
    <!-- WIDGET HEADER -->
    <div class="widget-header border-b border-white/[0.06] pb-3">
      <div class="flex items-center gap-2">
        <span class="text-base">🎨</span>
        <div>
          <h2 id="theme-customizer-title" class="text-xs font-semibold text-white tracking-wide">
            Aesthetic Themes & Ambient Wallpapers
          </h2>
          <p class="text-[10px] text-ink-500">ปรับแต่งบรรยากาศห้องอ่านหนังสือดิจิทัล</p>
        </div>
      </div>
      <button
        type="button"
        class="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-[11px] text-ink-400 hover:text-white transition cursor-pointer"
        title="รีเซ็ตธีมกลับเป็นค่าเริ่มต้น"
        @click="resetTheme"
      >
        ↺ รีเซ็ต
      </button>
    </div>

    <!-- WIDGET BODY -->
    <div class="widget-body flex flex-1 flex-col gap-4 p-4 overflow-y-auto scroll-thin">
      <!-- 1. ACCENT COLOR PICKER -->
      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-medium text-white flex items-center gap-1.5">
            <span>✨</span> สีไฮไลต์ (Accent Color)
          </span>
          <span class="text-[11px] font-mono text-accent">{{ activeAccent.name }}</span>
        </div>

        <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
          <button
            v-for="color in ACCENT_PRESETS"
            :key="color.id"
            type="button"
            class="group relative flex flex-col items-center gap-1.5 rounded-xl border p-2 text-center transition cursor-pointer"
            :class="theme.accentId === color.id
              ? 'border-accent bg-accent/15 ring-2 ring-accent/30 shadow-md'
              : 'border-white/[0.06] bg-ink-800/40 hover:bg-white/[0.04] hover:border-white/20'"
            @click="setAccent(color.id)"
          >
            <span
              class="h-6 w-6 rounded-full shadow-inner transition group-hover:scale-110 flex items-center justify-center"
              :style="{ backgroundColor: color.hex }"
            >
              <span v-if="theme.accentId === color.id" class="text-[10px] text-white font-bold drop-shadow">✓</span>
            </span>
            <span class="text-[10px] text-ink-300 font-medium truncate w-full">{{ color.name }}</span>
          </button>
        </div>
      </div>

      <!-- 2. DYNAMIC BACKGROUND PRESETS -->
      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-medium text-white flex items-center gap-1.5">
            <span>🖼️</span> บรรยากาศพื้นหลัง (Ambient Wallpaper)
          </span>
          <span class="text-[10px] text-ink-500">{{ activeWallpaper.name }}</span>
        </div>

        <div class="grid grid-cols-2 gap-2.5">
          <button
            v-for="wp in WALLPAPER_PRESETS"
            :key="wp.id"
            type="button"
            class="group relative flex flex-col justify-between rounded-xl border p-2.5 text-left transition overflow-hidden cursor-pointer min-h-[75px]"
            :class="theme.wallpaperId === wp.id && !theme.customWallpaperUrl
              ? 'border-accent bg-accent/10 ring-2 ring-accent/40 shadow-lg'
              : 'border-white/[0.06] bg-ink-800/40 hover:border-white/20 hover:bg-white/[0.03]'"
            @click="setWallpaper(wp.id)"
          >
            <!-- Thumbnail background -->
            <div
              v-if="wp.url"
              class="absolute inset-0 opacity-25 group-hover:opacity-40 transition bg-cover bg-center pointer-events-none"
              :style="{ backgroundImage: `url(${wp.url})` }"
            />
            <div class="relative z-10 flex items-center justify-between">
              <span class="text-lg">{{ wp.icon }}</span>
              <span
                v-if="theme.wallpaperId === wp.id && !theme.customWallpaperUrl"
                class="rounded-full bg-accent/80 px-1.5 py-0.2 text-[9px] font-bold text-white shadow-sm"
              >
                เลือกอยู่
              </span>
            </div>
            <div class="relative z-10 mt-2">
              <p class="text-xs font-semibold text-white">{{ wp.name }}</p>
              <p class="text-[10px] text-ink-400 line-clamp-1 mt-0.5">{{ wp.desc }}</p>
            </div>
          </button>
        </div>

        <!-- Custom Image URL Input -->
        <div class="rounded-xl border border-white/[0.06] bg-ink-800/30 p-2.5 space-y-1.5">
          <div class="flex items-center justify-between text-[11px] text-ink-400">
            <span>หรือใส่ URL รูปภาพของคุณเอง:</span>
            <button
              v-if="theme.customWallpaperUrl"
              type="button"
              class="text-rose-400 hover:underline cursor-pointer"
              @click="setCustomWallpaper('')"
            >
              ลบรูปกำหนดเอง
            </button>
          </div>
          <div class="flex gap-2">
            <input
              v-model="customUrlInput"
              type="url"
              placeholder="https://example.com/wallpaper.jpg"
              class="input text-xs py-1.5 px-3 flex-1"
              @keydown.enter="applyCustomUrl"
            />
            <button
              type="button"
              class="btn btn-primary text-xs py-1.5 px-3 shrink-0"
              @click="applyCustomUrl"
            >
              ใช้รูปนี้
            </button>
          </div>
        </div>
      </div>

      <!-- 3. BACKGROUND DIMMER SLIDER -->
      <div class="rounded-xl border border-white/[0.06] bg-ink-800/40 p-3 space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-medium text-white flex items-center gap-1.5">
            <span>🔆</span> ความมืดของพื้นหลัง (Dimmer Overlay)
          </span>
          <span class="font-mono text-xs font-bold text-accent">{{ theme.dimmer }}%</span>
        </div>
        <p class="text-[10px] text-ink-400">
          ปรับความเข้มเพื่อให้อ่านตัวหนังสือและดูวิดเจ็ตได้ชัดเจน ไม่แย่งความเด่นของเนื้อหา
        </p>
        <div class="flex items-center gap-3 pt-1">
          <span class="text-xs text-ink-500">สว่าง</span>
          <input
            v-model.number="theme.dimmer"
            type="range"
            min="0"
            max="95"
            step="5"
            class="w-full accent-accent cursor-pointer h-1.5 bg-ink-700 rounded-lg appearance-none"
          />
          <span class="text-xs text-ink-500">มืด</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '~/composables/useTheme'

const {
  theme,
  activeWallpaper,
  activeAccent,
  setWallpaper,
  setCustomWallpaper,
  setAccent,
  resetTheme,
  WALLPAPER_PRESETS,
  ACCENT_PRESETS
} = useTheme()

const customUrlInput = ref(theme.value.customWallpaperUrl || '')

function applyCustomUrl() {
  if (customUrlInput.value.trim()) {
    setCustomWallpaper(customUrlInput.value.trim())
  }
}
</script>
