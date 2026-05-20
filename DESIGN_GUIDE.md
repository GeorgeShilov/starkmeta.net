# 🎨 Design Guide — heimdall.land

> Инструкция по созданию, генерации и вёрстке дизайна для SaaS-проекта.

---

## 1. Общая концепция

**Стиль:** Тёмный минимализм с неоновыми акцентами  
**Референсы:** Linear, Vercel, Stripe, Framer  
**Настроение:** Технологичный, премиальный, футуристичный  
**Основные приёмы:** Glassmorphism, 3D-абстракции, градиентные свечения, чистая типографика

---

## 2. Цветовая палитра

| Роль | HEX | Использование |
|------|-----|---------------|
| Background (main) | `#0A0A0F` | Основной фон страницы |
| Background (card) | `#111118` / `rgba(17, 17, 24, 0.6)` | Фон карточек, glassmorphism |
| Primary accent | `#6366F1` | Кнопки, ссылки, активные элементы |
| Secondary accent | `#A855F7` | Градиенты, hover-эффекты |
| Gradient glow | `linear-gradient(135deg, #6366F1, #A855F7)` | Borders, buttons, highlights |
| Text primary | `#F8FAFC` | Заголовки, основной текст |
| Text secondary | `#94A3B8` | Описания, подписи |
| Border subtle | `rgba(99, 102, 241, 0.2)` | Рамки карточек, разделители |

---

## 3. Типографика

| Элемент | Шрифт | Размер | Вес | Line-height |
|---------|-------|--------|-----|-------------|
| H1 (Hero) | Inter / Geist | 64–80px | 700 | 1.1 |
| H2 (Section) | Inter / Geist | 40–48px | 600 | 1.2 |
| H3 (Card title) | Inter / Geist | 20–24px | 600 | 1.3 |
| Body | Inter | 16px | 400 | 1.6 |
| Caption | Inter | 14px | 400 | 1.5 |
| Button | Inter | 14–16px | 500 | 1 |

---

## 4. Компоненты

### 4.1. Навигация
- Логотип слева
- Центральные ссылки: Features, Pricing, About, Blog
- Справа: Search + кнопка "Get Started" (с градиентной рамкой)
- Фиксированная, с blur-фоном при скролле (`backdrop-filter: blur(12px)`)

### 4.2. Hero-секция
- Крупный заголовок (2–3 строки)
- Подзаголовок — 1–2 предложения
- Две CTA-кнопки: Primary (градиент) + Secondary (outline)
- Справа/снизу: 3D-иллюстрация или мокап дашборда
- Фон: тёмный с размытыми градиентными шарами/орбами

### 4.3. Features (3 карточки)
- Иконка в круге (с градиентным фоном)
- Заголовок карточки
- Описание 2–3 строки
- Glassmorphism фон: `background: rgba(17, 17, 24, 0.6); backdrop-filter: blur(16px);`
- Градиентная рамка при hover

### 4.4. Pricing (3 тарифа)
- Monthly / Yearly переключатель
- Карточки с чёткими границами
- Средний тариф выделен: glowing border + "Most Popular" бейдж
- Чек-лист фичей с иконками ✓
- Кнопка CTA внизу каждой карточки

### 4.5. Testimonials (3 отзыва)
- Аватарка (круглая, 64px)
- Имя + должность
- Текст отзыва (2–3 предложения)
- Звёздочки рейтинга
- Карточка на glassmorphism фоне

### 4.6. Footer
- Логотип + слоган
- 3–4 колонки ссылок (Product, Company, Resources, Legal)
- Email-форма подписки
- Иконки соцсетей
- Copyright строка внизу

---

## 5. Генерация дизайна через fal.ai

### 5.1. Настройка
1. Зарегистрируйся на [fal.ai](https://fal.ai)
2. Получи API-ключ в dashboard
3. Сохрани ключ в переменную окружения:
   ```bash
   export FAL_KEY="your-api-key"
   ```

### 5.2. Лучшие модели для UI

| Модель | Качество | Скорость | Когда использовать |
|--------|----------|----------|-------------------|
| `fal-ai/flux-pro/v1.1` | ⭐⭐⭐⭐⭐ | Медленно | Финальные макеты, презентации |
| `fal-ai/flux-pro` | ⭐⭐⭐⭐⭐ | Средне | Основные экраны |
| `fal-ai/flux/dev` | ⭐⭐⭐⭐ | Быстро | Эксперименты, драфты |

### 5.3. Шаблоны промптов

#### Hero / Landing
```
Modern SaaS website landing page UI design, dark navy and black theme 
with electric blue and purple gradient accents, minimalist clean interface, 
large bold typography, hero section with abstract 3D geometric shapes floating, 
glassmorphism feature cards, sleek navigation bar with logo, primary CTA button 
glowing, dashboard preview mockup, fintech AI startup aesthetic, 
dribbble behance award winning UI UX design, professional high quality, 
4k render, web design mockup
```

#### Features
```
Modern SaaS website Features section UI design, dark navy and black theme 
with electric blue and purple gradient accents, 3 feature cards in a row 
with glassmorphism effect, each card has an icon and title and description, 
minimalist clean interface, grid layout, subtle glow effects, 
dribbble behance award winning UI UX design, professional high quality, 
web design mockup
```

#### Pricing
```
Modern SaaS website Pricing section UI design, dark navy and black theme 
with electric blue and purple gradient accents, 3 pricing tiers cards side by side, 
highlighted middle tier with glowing border, monthly yearly toggle button, 
feature checklist icons, minimalist clean interface, glassmorphism cards, 
dribbble behance award winning UI UX design, professional high quality, 
web design mockup
```

#### Testimonials
```
Modern SaaS website Testimonials section UI design, dark navy and black theme 
with electric blue and purple gradient accents, 3 testimonial cards 
with user avatars circular photos, quotes text, star ratings, company logos, 
clean grid layout, glassmorphism card effects, minimalist interface, 
dribbble behance award winning UI UX design, professional high quality, 
web design mockup
```

#### Footer
```
Modern SaaS website Footer UI design, dark navy and black theme 
with electric blue and purple gradient accents, multi-column footer 
with logo, navigation links columns, social media icons, 
newsletter email input field with subscribe button, copyright bar at bottom, 
subtle top border gradient, minimalist clean interface, 
dribbble behance award winning UI UX design, professional high quality, 
web design mockup
```

### 5.4. API-запрос (curl)

```bash
curl -X POST "https://fal.run/fal-ai/flux-pro/v1.1" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "YOUR_PROMPT_HERE",
    "image_size": "landscape_16_9",
    "num_inference_steps": 28,
    "guidance_scale": 3.5,
    "output_format": "png"
  }'
```

**Параметры:**
- `image_size`: `landscape_16_9` (для UI-макетов), `portrait_16_9`, `square_1_1`
- `guidance_scale`: 3.5–5 (выше = точнее следовать промпту)
- `num_inference_steps`: 28–50 (больше = лучше качество, но дольше)

### 5.5. Советы по промптингу

1. **Всегда начинай с контекста:** `Modern SaaS website ... UI design`
2. **Указывай тему:** `dark navy and black theme with blue and purple accents`
3. **Добавляй стилистические метки:** `glassmorphism, minimalist, clean interface`
4. **Качество-маркеры:** `dribbble behance award winning, professional high quality, 4k`
5. **Формат:** `web design mockup` — помогает AI понять, что это UI, а не фото
6. **Избегай:** слишком длинных промптов (>500 символов), абстрактных описаний без UI-контекста

### 5.6. Адаптация промпта под тематику проекта (webarchive)

Перед генерацией дизайна **обязательно изучите тематику конкретного проекта:**

- Если в проекте есть папка `webarchive/` — изучите её содержимое (скриншоты, тексты, референсы, старые версии сайта)
- Если `webarchive/` отсутствует — проанализируйте `README.md`, `AGENTS.md`, контент страниц и название домена
- Извлеките ключевые темы: **индустрия, целевая аудитория, продукт, визуальный стиль, брендовые цвета**

**Адаптируйте промпт, заменяя generic SaaS-описание на конкретную тематику проекта:**

| Без тематики | С тематикой из webarchive |
|-------------|---------------------------|
| `Modern SaaS website landing page UI design...` | `Modern crypto trading dashboard UI design, dark theme...` |
| `fintech AI startup aesthetic` | `DeFi wallet security aesthetic, blockchain nodes visualization` |
| `dashboard preview mockup` | `portfolio analytics chart mockup, real-time market data widgets` |

**Правила адаптации:**
- Замените слово `SaaS` на конкретный тип продукта (wallet, exchange, marketplace, gateway, etc.)
- Добавьте 2–3 визуальных элемента, специфичных для ниши (например, для крипто — `chart candlesticks`, `node network map`, `wallet cards`)
- Сохраните базовые дизайн-приёмы: `dark theme`, `glassmorphism`, `gradient accents`
- Если в webarchive есть скриншоты — используйте их как референс для цветовой палитры

> 💡 **Результат:** адаптированный промпт повышает релевантность генерации в 2–3 раза. AI лучше понимает контекст и генерирует дизайн, который соответствует реальной тематике проекта, а не generic шаблону.

---

## 6. Из референса в код (Astro)

### 6.1. Структура компонентов

```
src/
├── components/
│   ├── Navbar.astro
│   ├── Hero.astro
│   ├── Features.astro
│   ├── Pricing.astro
│   ├── Testimonials.astro
│   └── Footer.astro
├── layouts/
│   └── Layout.astro
├── styles/
│   └── global.css
└── pages/
    └── index.astro
```

### 6.2. CSS-утилиты (глобальные)

```css
/* Glassmorphism card */
.glass-card {
  background: rgba(17, 17, 24, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.glass-card:hover {
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.15);
}

/* Gradient button */
.btn-primary {
  background: linear-gradient(135deg, #6366F1, #A855F7);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: opacity 0.2s;
}

/* Gradient border (для карточек pricing) */
.gradient-border {
  position: relative;
  background: #111118;
  border-radius: 16px;
}

.gradient-border::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 18px;
  background: linear-gradient(135deg, #6366F1, #A855F7);
  z-index: -1;
}
```

### 6.3. Workflow

1. **Сгенерировать референсы** через fal.ai (см. раздел 5)
2. **Сохранить** PNG в `design-generated/`
3. **Извлечь палитру** глазами или через пипетку (Figma, Photoshop, или онлайн-инструмент)
4. **Создать Layout** с глобальными стилями и шрифтами
5. **Верстать по очереди:** Navbar → Hero → Features → Pricing → Testimonials → Footer
6. **Адаптивность:** mobile-first, breakpoints `768px` и `1024px`

---

## 7. Чек-лист перед деплоем

- [ ] Все секции свёрстаны и соответствуют референсам
- [ ] Адаптивность проверена на mobile/tablet/desktop
- [ ] Цвета соответствуют палитре (раздел 2)
- [ ] Шрифты загружены и работают
- [ ] Анимации и hover-эффекты плавные (300–400ms)
- [ ] Изображения оптимизированы (WebP, lazy loading)
- [ ] SEO: title, meta description, Open Graph

---

## 8. Полезные ссылки

- **fal.ai API docs:** https://fal.ai/docs
- **Шрифты:** [Google Fonts — Inter](https://fonts.google.com/specimen/Inter), [Vercel Geist](https://vercel.com/font)
- **Иконки:** [Lucide](https://lucide.dev), [Phosphor Icons](https://phosphoricons.com)
- **Градиенты:** [uiGradients](https://uigradients.com)
- **Glassmorphism генератор:** https://hype4.academy/tools/glassmorphism-generator

---

*Последнее обновление: 2026-05-20*
