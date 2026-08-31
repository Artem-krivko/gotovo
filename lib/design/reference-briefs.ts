// lib/design/reference-briefs.ts — эталонные брифы для проверки генератора.
//
// Набор специально разнородный: если генератор выдаёт похожие страницы,
// это видно именно на таких контрастных нишах. Медцентр и автосервис,
// свадебный фотограф и логистика не должны выглядеть одинаково.
//
// Используется в lib/__tests__/quality.test.mts.

import type { GeneratorStyle } from "@/lib/types"

export interface ReferenceBrief {
  id: string
  businessType: string
  businessName?: string
  userDescription: string
  style: GeneratorStyle
  /** Ниши, с которыми результат НЕ должен совпадать по композиции. */
  contrastWith?: string[]
  audience?: string
  mainAction?: string
  geography?: string
  advantages?: string[]
  serviceAreas?: string[]
  priceFrom?: string
  caseStudy?: { title: string; summary: string; result?: string }
  teamMember?: { name: string; role: string }
  beforeAfter?: boolean
}

export const REFERENCE_BRIEFS: ReferenceBrief[] = [
  {
    id: "dental",
    businessType: "Стоматология",
    businessName: "Дентал Плюс",
    userDescription: "Частная стоматология в Минске. Имплантация, брекеты, лечение кариеса под микроскопом.",
    style: "corporate",
    contrastWith: ["gym", "wedding-photo", "car-service"],
  },
  {
    id: "beauty-salon",
    businessType: "Салон красоты",
    userDescription: "Салон в центре города: стрижки, окрашивание, маникюр, перманентный макияж бровей.",
    style: "minimal",
    contrastWith: ["construction", "logistics"],
  },
  {
    id: "coffee",
    businessType: "Кофейня / кафе",
    userDescription: "Небольшая specialty-кофейня, обжарка на месте, авторские десерты, завтраки весь день.",
    style: "minimal",
  },
  {
    id: "restaurant",
    businessType: "Ресторан",
    userDescription: "Ресторан европейской кухни, сезонное меню, винная карта, банкетный зал на 60 человек.",
    style: "modern",
  },
  {
    id: "gym",
    businessType: "Фитнес-клуб",
    userDescription: "Тренажёрный зал и групповые программы, персональные тренировки, зона единоборств.",
    style: "bold",
    contrastWith: ["dental", "law"],
  },
  {
    id: "law",
    businessType: "Юридические услуги",
    userDescription: "Юридическая помощь бизнесу: договоры, суды, регистрация компаний, налоговые споры.",
    style: "corporate",
    contrastWith: ["gym", "beauty-salon"],
  },
  {
    id: "accounting",
    businessType: "Бухгалтерские услуги",
    userDescription: "Бухгалтерское сопровождение ИП и ООО, отчётность, кадровый учёт, восстановление учёта.",
    style: "corporate",
  },
  {
    id: "it-agency",
    businessType: "IT-агентство",
    userDescription: "Разработка веб-сервисов и мобильных приложений, интеграции, техническая поддержка.",
    style: "modern",
  },
  {
    id: "construction",
    businessType: "Строительная компания",
    userDescription: "Строительство домов под ключ, фундаменты, кровля, фасадные работы, инженерные сети.",
    style: "bold",
    contrastWith: ["beauty-salon", "wedding-photo"],
  },
  {
    id: "septic-installation",
    businessType: "Строительная компания",
    businessName: "Деколюкс",
    userDescription: "Монтаж септиков и бурение скважин для частных домов в Могилёвской области.",
    style: "corporate",
    audience: "Семьи, которые строят загородный дом",
    mainAction: "Получить расчёт и согласовать выезд",
    geography: "Могилёвская область",
    advantages: ["Свой монтажный инструмент", "Работа по договору", "Один подрядчик на обе системы"],
    serviceAreas: ["Могилёв", "Могилёвский район", "Шклов", "Быхов"],
    priceFrom: "от 2 500 BYN",
    caseStudy: {
      title: "Автономные коммуникации для дома",
      summary: "Смонтировали септик и подготовили скважину на одном участке.",
      result: "Обе системы сданы после проверки герметичности",
    },
    teamMember: { name: "Алексей", role: "Инженер проекта" },
    beforeAfter: true,
    contrastWith: ["beauty-salon", "wedding-photo"],
  },
  {
    id: "medical-center",
    businessType: "Медицинская клиника",
    userDescription: "Многопрофильный медцентр: терапия, УЗИ, анализы, врачи узких специальностей.",
    style: "corporate",
  },
  {
    id: "courses",
    businessType: "Образование / курсы",
    userDescription: "Курсы программирования для взрослых, вечерний формат, практика на реальных проектах.",
    style: "modern",
  },
  {
    id: "realestate",
    businessType: "Недвижимость",
    userDescription: "Агентство недвижимости: подбор квартир, сопровождение сделок, проверка документов.",
    style: "corporate",
  },
  {
    id: "ecommerce",
    businessType: "Интернет-магазин",
    userDescription: "Магазин товаров для дома: посуда, текстиль, декор. Доставка по стране.",
    style: "modern",
  },
  {
    id: "wedding-photo",
    businessType: "Фотограф / видеограф",
    userDescription: "Свадебная фотография и видеосъёмка, love story, репортажная манера, выездные съёмки.",
    style: "minimal",
    audience: "Пары, которые ценят живой репортаж без постановки",
    mainAction: "Проверить свободную дату",
    geography: "Беларусь и выездные съёмки",
    advantages: ["Один стиль фото и видео", "Сроки фиксируются в договоре", "Помощь с таймингом дня"],
    caseStudy: {
      title: "Камерная свадьба за городом",
      summary: "Фотосъёмка, короткий фильм и вечерний репортаж одной командой.",
      result: "Полная история дня в единой цветокоррекции",
    },
    teamMember: { name: "Анна", role: "Фотограф и арт-директор" },
    contrastWith: ["dental", "construction", "logistics"],
  },
  {
    id: "car-service",
    businessType: "Автосервис",
    userDescription: "Ремонт и диагностика автомобилей, кузовной ремонт, шиномонтаж, компьютерная диагностика.",
    style: "bold",
    contrastWith: ["dental", "beauty-salon"],
  },
  {
    id: "logistics",
    businessType: "Доставка и логистика",
    userDescription: "Грузоперевозки по стране и СНГ, экспедирование, складское хранение, документы.",
    style: "corporate",
    contrastWith: ["beauty-salon", "wedding-photo"],
  },
  {
    id: "barbershop",
    businessType: "Барбершоп",
    userDescription: "Мужские стрижки, оформление бороды, королевское бритьё, атмосфера классического барбершопа.",
    style: "bold",
  },
  {
    id: "vet",
    businessType: "Ветеринарная клиника",
    userDescription: "Ветклиника: приём, вакцинация, хирургия, УЗИ, стационар для животных.",
    style: "modern",
  },
  {
    id: "flowers",
    businessType: "Цветочный магазин",
    userDescription: "Букеты и композиции, оформление мероприятий, подписка на цветы, доставка по городу.",
    style: "minimal",
  },
  {
    id: "furniture",
    businessType: "Мебель на заказ",
    userDescription: "Кухни и шкафы на заказ, замер, проектирование, собственное производство, установка.",
    style: "corporate",
  },
  {
    id: "cleaning",
    businessType: "Клининговая компания",
    userDescription: "Уборка квартир и офисов, генеральная уборка, после ремонта, химчистка мебели.",
    style: "modern",
  },
  {
    id: "psychologist",
    businessType: "Психолог",
    userDescription: "Индивидуальные консультации, работа с тревогой и выгоранием, очно и онлайн.",
    style: "minimal",
  },
  {
    id: "language-school",
    businessType: "Языковая школа",
    userDescription: "Английский для взрослых и детей, разговорные клубы, подготовка к экзаменам.",
    style: "modern",
  },
  {
    id: "printing",
    businessType: "Типография",
    userDescription: "Печать полиграфии, визитки, баннеры, наклейки, брендирование сувенирной продукции.",
    style: "bold",
  },
  {
    id: "travel",
    businessType: "Туристическое агентство",
    userDescription: "Подбор туров, авиабилеты, визовая поддержка, индивидуальные маршруты.",
    style: "modern",
  },
  {
    id: "architect",
    businessType: "Архитектурное бюро",
    userDescription: "Проектирование частных домов и интерьеров, авторский надзор, визуализации.",
    style: "minimal",
  },
  {
    id: "security",
    businessType: "Охранное агентство",
    userDescription: "Физическая охрана объектов, пультовая охрана, установка систем видеонаблюдения.",
    style: "corporate",
  },
  {
    id: "catering",
    businessType: "Кейтеринг",
    userDescription: "Выездное обслуживание мероприятий, фуршеты, банкеты, корпоративные обеды.",
    style: "modern",
  },
  {
    id: "tailor",
    businessType: "Ателье",
    userDescription: "Пошив и ремонт одежды, подгонка по фигуре, реставрация, работа с деликатными тканями.",
    style: "minimal",
  },
  {
    id: "solar",
    businessType: "Солнечные панели",
    userDescription: "Проектирование и монтаж солнечных электростанций для дома и бизнеса, расчёт окупаемости.",
    style: "bold",
  },
]
