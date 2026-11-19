import type { CategoryKey, Language, UniversityKey } from '../types';

export const TRANSLATIONS: Record<
  Language,
  {
    brandSubtitle: string;
    tabs: { home: string; sell: string; profile: string };
    header: {
      homeTitle: string;
      sellTitle: string;
      profileTitle: string;
      detailTitle: string;
      verifiedBadge: string;
      allUniversities: string;
      searchPlaceholder: string;
      sortNewest: string;
      sortPriceLow: string;
      sortPopular: string;
    };
    universities: Record<UniversityKey, string>;
    categories: Record<CategoryKey, string>;
    verifiedToggle: {
      title: string;
      subtitle: string;
    };
    feed: {
      sectionTitle: string;
      freshCount: (n: number) => string;
      currency: string;
      seedNotice: string;
      emptySearch: string;
      resetFilters: string;
      loading: string;
    };
    banners: Array<{
      badge: string;
      meta: string;
      title: string;
      subtitle: string;
    }>;
    detail: {
      viewingNow: (n: number) => string;
      saveBadge: (amount: number) => string;
      retailLabel: (retail: number) => string;
      pickupLabel: string;
      verifiedStudent: string;
      mannerTempLabel: string;
      avgTemp: string;
      topReliable: string;
      dealsLabel: string;
      ratingLabel: string;
      responseLabel: string;
      responseValue: string;
      safeDealTitle: string;
      safeChecks: Array<{ title: string; desc: string }>;
      meetupSpotTitle: string;
      walkTime: string;
      meetupNote: string;
      wordFrom: (name: string) => string;
      convenientHours: string;
      proposePrice: string;
      acceptanceChance: string;
      takeToday: string;
      proposeMeetupCta: string;
      shareCopied: string;
      likeSaved: string;
    };
    sell: {
      title: string;
      reset: string;
      promoBadge: string;
      promoText: string;
      photosLabel: string;
      photoTip: string;
      addPhoto: string;
      changePhoto: string;
      photoSelected: string;
      photoAdvice: string;
      titlePrompt: string;
      titlePlaceholder: string;
      categoryLabel: string;
      priceLabel: string;
      negotiableTitle: string;
      negotiableSub: string;
      safeZoneLabel: string;
      conditionLabel: string;
      conditions: string[];
      descLabel: string;
      descPlaceholder: string;
      safetyBoxTitle: string;
      safetyBoxDesc: string;
      publishCta: string;
      publishing: string;
      publishFoot: string;
      authRequiredTitle: string;
      authRequiredDesc: string;
      goToLogin: string;
      errorMissingPhoto: string;
      errorMissingFields: string;
      publishSuccess: string;
    };
    meetupModal: {
      title: string;
      subtitle: string;
      safeZoneLabel: string;
      timeLabel: string;
      times: string[];
      paymentLabel: string;
      payments: string[];
      offerLabel: string;
      messageLabel: string;
      messagePlaceholder: string;
      submitCta: string;
      submitting: string;
      successTitle: string;
      successDesc: string;
      doneBtn: string;
      loginNeeded: string;
    };
    profile: {
      signInTab: string;
      signUpTab: string;
      welcomeTitle: string;
      welcomeSub: string;
      emailLabel: string;
      passwordLabel: string;
      nicknameLabel: string;
      nicknamePlaceholder: string;
      universityLabel: string;
      majorLabel: string;
      majorPlaceholder: string;
      signInBtn: string;
      signUpBtn: string;
      signingIn: string;
      signingUp: string;
      signOutBtn: string;
      myListingsTab: string;
      meetupsTab: string;
      noListings: string;
      createFirstListing: string;
      noMeetups: string;
      deleteListing: string;
      statusPending: string;
      statusAccepted: string;
      statusDeclined: string;
      acceptBtn: string;
      declineBtn: string;
      buyerLabel: string;
      sellerLabel: string;
      configBannerTitle: string;
      configBannerDesc: string;
      showSqlBtn: string;
      hideSqlBtn: string;
      copySqlBtn: string;
      sqlCopied: string;
      checkEmailConfirm: string;
    };
    safeZones: string[];
  }
> = {
  ru: {
    brandSubtitle: 'Студенты Бишкека',
    tabs: {
      home: 'Главная',
      sell: 'Продать',
      profile: 'Профиль',
    },
    header: {
      homeTitle: 'Главная',
      sellTitle: 'Продажа',
      profileTitle: 'Профиль',
      detailTitle: 'О товаре',
      verifiedBadge: '100% свой вуз',
      allUniversities: 'Все вузы',
      searchPlaceholder: 'Что ищешь? Учебник, чайник или худи...',
      sortNewest: 'Сначала новые',
      sortPriceLow: 'Сначала дешевле',
      sortPopular: 'Популярные',
    },
    universities: {
      all: 'Все вузы',
      KNU: 'КНУ (Ж. Баласагына)',
      AUCA: 'АУЦА (AUCA)',
      'Manas University': 'КТУ Манас',
      KRSU: 'КРСУ',
    },
    categories: {
      all: 'Всё подряд',
      textbooks: 'Учебники',
      electronics: 'Техника',
      dorm: 'В общагу',
      clothing: 'Одежда',
    },
    verifiedToggle: {
      title: 'Показывать только своих',
      subtitle: 'Ребята с проверенной зачёткой и студиком',
    },
    feed: {
      sectionTitle: 'Что отдают ребята на кампусе',
      freshCount: (n) => `${n} свежих находок`,
      currency: 'сом',
      seedNotice: 'Демо-витрина Бишкека — войди и выложи свою первую вещь',
      emptySearch: 'Ничего не найдено по вашему фильтру',
      resetFilters: 'Сбросить фильтры',
      loading: 'Загружаем находки кампуса...',
    },
    banners: [
      {
        badge: 'ПРИВЕТ, СТУДЕНТ!',
        meta: 'Бишкек',
        title: 'Забирай учебники за копейки к сессии!',
        subtitle: 'Передадим прямо на перемене из рук в руки, без суеты',
      },
      {
        badge: 'БЕЗ ПРЕДОПЛАТ',
        meta: '100% ВУЗ',
        title: 'Встреча в холле твоего университета',
        subtitle: 'Листай и проверяй вещь на месте — оплата наличными или MBank',
      },
      {
        badge: 'КЭШ ЗА ПОЛКУ',
        meta: '0% КОМИССИИ',
        title: 'Продай учебники и технику однокурсникам',
        subtitle: 'Бесплатное размещение за 60 секунд для студентов Бишкека',
      },
    ],
    detail: {
      viewingNow: (n) => `Смотрят прямо сейчас: ${n} студента`,
      saveBadge: (amount) => `Экономишь ${amount.toLocaleString('ru-RU')} сом!`,
      retailLabel: (retail) => `В магазине такой стоит ${retail.toLocaleString('ru-RU')} сом`,
      pickupLabel: 'Где забрать:',
      verifiedStudent: 'Студент подтверждён',
      mannerTempLabel: 'Температура доверия',
      avgTemp: 'В среднем по вузу 36.5°C',
      topReliable: 'Топ 1% надёжных ребят',
      dealsLabel: 'удачные сделки',
      ratingLabel: 'рейтинг',
      responseLabel: 'Отвечает за',
      responseValue: '~5 мин',
      safeDealTitle: 'Спокойная сделка прямо в вузе',
      safeChecks: [
        {
          title: 'Свой студент по зачётке',
          desc: 'Никаких анонимов, только реальные студенты вузов Бишкека.',
        },
        {
          title: 'Посмотри и проверь перед оплатой',
          desc: 'Никаких предоплат. Проверяй на месте, переводи на MBank/Оптиму или плати налом.',
        },
        {
          title: 'Встреча в светлом месте под камерами',
          desc: 'Передача прямо в холле универа, где всегда люди и охрана.',
        },
      ],
      meetupSpotTitle: 'Место встречи',
      walkTime: '2 мин от главных ворот',
      meetupNote: 'Прямо у турникетов и поста охраны, светло и безопасно.',
      wordFrom: (name) => `Слово от ${name}`,
      convenientHours: 'Удобно передать между парами (11:45 или 14:10) у входа.',
      proposePrice: 'Предложить свою цену:',
      acceptanceChance: '95% шанс согласия',
      takeToday: 'заберу сегодня',
      proposeMeetupCta: 'Договориться о встрече (наличные или MBank)',
      shareCopied: 'Ссылка на объявление скопирована',
      likeSaved: 'Добавлено в избранное',
    },
    sell: {
      title: 'Выложить вещь',
      reset: 'Очистить',
      promoBadge: 'БЫСТРЫЕ ДЕНЬГИ В УНИВЕРЕ',
      promoText: 'Старые учебники на полке превратятся в 1 500 сом уже сегодня! Студенты в Бишкеке как раз ищут.',
      photosLabel: 'Фотографии',
      photoTip: 'С живыми фото покупают в 3 раза быстрее!',
      addPhoto: 'Добавить фото',
      changePhoto: 'Заменить',
      photoSelected: 'Фото выбрано',
      photoAdvice: 'Совет: сфоткай вещь при дневном свете или на столе в аудитории.',
      titlePrompt: 'Что продаёшь?',
      titlePlaceholder: 'например, Учебник по экономике 10-е изд.',
      categoryLabel: 'Категория',
      priceLabel: 'Цена в сомах (KGS)',
      negotiableTitle: 'Студенческий торг (скину немного своему)',
      negotiableSub: 'Открыт к встречным предложениям от однокурсников',
      safeZoneLabel: 'Проверенное место в кампусе (где встретиться)',
      conditionLabel: 'Состояние вещи',
      conditions: ['Новая', 'Как новая', 'Б/у в порядке', 'Боевая / Сойдет'],
      descLabel: 'Пара слов о вещи и когда удобно пересечься',
      descPlaceholder: 'Расскажи о состоянии, есть ли пометки, и в какое время между парами свободен...',
      safetyBoxTitle: 'Передача из рук в руки прямо в кампусе',
      safetyBoxDesc: 'Все встречи днём между парами. Никаких подозрительных предоплат на сторонние кошельки.',
      publishCta: 'Опубликовать (Бесплатно для студентов)',
      publishing: 'Загружаем фото и публикуем...',
      publishFoot: 'Сразу появится в лентах КНУ, АУЦА, Манаса и КРСУ',
      authRequiredTitle: 'Войдите, чтобы выложить вещь',
      authRequiredDesc: 'Маркетплейс работает только для подтверждённых студентов Бишкека.',
      goToLogin: 'Войти / Регистрация',
      errorMissingPhoto: 'Пожалуйста, выберите или сфотографируйте товар.',
      errorMissingFields: 'Укажите название, цену и место встречи в кампусе.',
      publishSuccess: 'Объявление опубликовано в ленту!',
    },
    meetupModal: {
      title: 'Назначить встречу',
      subtitle: 'Без предоплат — оплата при осмотре на месте',
      safeZoneLabel: 'Безопасная зона кампуса',
      timeLabel: 'Удобное время между парами',
      times: ['11:45 (Перемена)', '14:10 (После пар)', '16:30 (Вечер)', 'Договоримся'],
      paymentLabel: 'Способ оплаты на месте',
      payments: ['Наличные (сом)', 'MBank / Оптима'],
      offerLabel: 'Ваше предложение цены (сом)',
      messageLabel: 'Сообщение продавцу',
      messagePlaceholder: 'Привет! Могу забрать сегодня между парами в холле...',
      submitCta: 'Отправить запрос на встречу',
      submitting: 'Отправка запроса...',
      successTitle: 'Запрос на встречу отправлен!',
      successDesc: 'Продавец увидит ваше предложение в своём профиле и подтвердит время.',
      doneBtn: 'Отлично',
      loginNeeded: 'Войдите в профиль, чтобы отправить запрос на встречу.',
    },
    profile: {
      signInTab: 'Вход',
      signUpTab: 'Регистрация',
      welcomeTitle: 'Студенческий профиль',
      welcomeSub: 'Войди со своим аккаунтом или зарегистрируйся за 30 секунд',
      emailLabel: 'Электронная почта',
      passwordLabel: 'Пароль',
      nicknameLabel: 'Имя или никнейм',
      nicknamePlaceholder: 'например, Айбек',
      universityLabel: 'Твой университет',
      majorLabel: 'Факультет и курс',
      majorPlaceholder: 'например, ФКН / IT, 3 курс',
      signInBtn: 'Войти в CampusMarket',
      signUpBtn: 'Создать профиль студента',
      signingIn: 'Входим...',
      signingUp: 'Создаём профиль...',
      signOutBtn: 'Выйти',
      myListingsTab: 'Мои объявления',
      meetupsTab: 'Встречи',
      noListings: 'У вас пока нет активных объявлений.',
      createFirstListing: 'Выложить первую вещь',
      noMeetups: 'Запросов на встречи пока нет.',
      deleteListing: 'Удалить',
      statusPending: 'Ожидает',
      statusAccepted: 'Подтверждено',
      statusDeclined: 'Отклонено',
      acceptBtn: 'Принять',
      declineBtn: 'Отклонить',
      buyerLabel: 'Покупатель',
      sellerLabel: 'Продавец',
      configBannerTitle: 'Подключите Supabase',
      configBannerDesc: 'Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в переменные окружения, чтобы включить реальную базу, вход и загрузку фото.',
      showSqlBtn: 'Показать SQL схему Supabase',
      hideSqlBtn: 'Скрыть SQL схему',
      copySqlBtn: 'Копировать SQL',
      sqlCopied: 'SQL скопирован!',
      checkEmailConfirm: 'Аккаунт создан! Если включено подтверждение почты в Supabase, проверьте email или войдите.',
    },
    safeZones: [
      'Холл библиотеки КНУ (Главный корпус)',
      'Столовая АУЦА (1 этаж)',
      'КПП 1 Манас (Главный вход)',
      'КРСУ Главный корпус (Холл)',
    ],
  },
  en: {
    brandSubtitle: 'Bishkek Students',
    tabs: {
      home: 'Home',
      sell: 'Sell',
      profile: 'My Page',
    },
    header: {
      homeTitle: 'Home',
      sellTitle: 'Sell',
      profileTitle: 'My Page',
      detailTitle: 'Item Details',
      verifiedBadge: '100% Student Verified',
      allUniversities: 'All Universities',
      searchPlaceholder: 'Search textbooks, kettle, or hoodie...',
      sortNewest: 'Newest first',
      sortPriceLow: 'Price: Low to High',
      sortPopular: 'Most popular',
    },
    universities: {
      all: 'All Universities',
      KNU: 'KNU',
      AUCA: 'AUCA',
      'Manas University': 'Manas Univ.',
      KRSU: 'KRSU',
    },
    categories: {
      all: 'All',
      textbooks: 'Textbooks',
      electronics: 'Electronics',
      dorm: 'Dorm/Living',
      clothing: 'Clothing',
    },
    verifiedToggle: {
      title: 'Verified students only',
      subtitle: 'Peers with confirmed student ID cards',
    },
    feed: {
      sectionTitle: 'Fresh campus finds',
      freshCount: (n) => `${n} fresh listings`,
      currency: 'сом',
      seedNotice: 'Bishkek campus preview — sign in to post your first item',
      emptySearch: 'No items match your current filter',
      resetFilters: 'Reset filters',
      loading: 'Loading campus finds...',
    },
    banners: [
      {
        badge: 'HEY STUDENT!',
        meta: 'Bishkek',
        title: 'Grab textbooks for pennies before finals!',
        subtitle: 'Hand-to-hand meetup between classes, zero hassle',
      },
      {
        badge: 'ZERO PREPAY',
        meta: 'CAMPUS SAFE',
        title: 'Meet safely right inside your campus lobby',
        subtitle: 'Inspect the item in person before paying via Cash or MBank',
      },
      {
        badge: 'TURN BOOKS TO CASH',
        meta: '0% FEES',
        title: 'Sell old gear & notes to classmates in 60s',
        subtitle: 'Free listings for KNU, AUCA, Manas & KRSU students',
      },
    ],
    detail: {
      viewingNow: (n) => `Viewing right now: ${n} students`,
      saveBadge: (amount) => `Save ${amount.toLocaleString('en-US')} сом vs. Retail!`,
      retailLabel: (retail) => `Retail bookstore price: ${retail.toLocaleString('en-US')} сом`,
      pickupLabel: 'Pickup Safe Zone:',
      verifiedStudent: 'Student Verified',
      mannerTempLabel: 'Manner Temp',
      avgTemp: 'Campus avg 36.5°C',
      topReliable: 'Top 1% trusted peer',
      dealsLabel: 'completed deals',
      ratingLabel: 'rating',
      responseLabel: 'Replies in',
      responseValue: '~5 min',
      safeDealTitle: 'Safe campus hand-off guarantee',
      safeChecks: [
        {
          title: 'Verified Bishkek Student',
          desc: 'No anonymous resellers—only verified university students.',
        },
        {
          title: 'Inspect before you pay',
          desc: 'Zero prepayment. Check the item in person and pay via Cash or MBank/Optima.',
        },
        {
          title: 'Well-lit lobby under security cameras',
          desc: 'Meetups happen at main campus halls with campus security nearby.',
        },
      ],
      meetupSpotTitle: 'Campus Safe Zone',
      walkTime: '2 min from main gate',
      meetupNote: 'Right next to the main turnstiles and security desk—bright and safe.',
      wordFrom: (name) => `Note from ${name}`,
      convenientHours: 'Happy to meet between classes (11:45 or 14:10) by the lobby.',
      proposePrice: 'Quick counter-offer:',
      acceptanceChance: '95% acceptance chance',
      takeToday: 'pick up today',
      proposeMeetupCta: 'Propose Meetup (Cash or MBank)',
      shareCopied: 'Listing link copied to clipboard',
      likeSaved: 'Saved to favorites',
    },
    sell: {
      title: 'List New Item',
      reset: 'Reset',
      promoBadge: 'FAST CAMPUS CASH',
      promoText: 'Turn unused textbooks & gear into 1,500 сом today! Bishkek students are searching right now.',
      photosLabel: 'Photos',
      photoTip: 'Real photos sell 3x faster!',
      addPhoto: 'Add Photo',
      changePhoto: 'Replace',
      photoSelected: 'Photo attached',
      photoAdvice: 'Tip: shoot in bright daylight on a library or dorm desk.',
      titlePrompt: 'What are you selling?',
      titlePlaceholder: 'e.g., Principles of Economics 10th Ed.',
      categoryLabel: 'Category',
      priceLabel: 'Price in KGS (сом)',
      negotiableTitle: 'Open to student offers',
      negotiableSub: 'Willing to negotiate slightly with classmates',
      safeZoneLabel: 'Verified campus safe zone (meetup spot)',
      conditionLabel: 'Item condition',
      conditions: ['New', 'Like New', 'Good', 'Fair'],
      descLabel: 'Item details & convenient meetup times',
      descPlaceholder: 'Share condition details, any highlights, and when you are free between classes...',
      safetyBoxTitle: 'In-person campus hand-off',
      safetyBoxDesc: 'All meetups happen during daytime between classes. Never send prepayments to external wallets.',
      publishCta: 'Publish Listing (Free for Students)',
      publishing: 'Uploading photo & publishing...',
      publishFoot: 'Appears immediately across KNU, AUCA, Manas & KRSU feeds',
      authRequiredTitle: 'Sign in to list an item',
      authRequiredDesc: 'CampusMarket KG is exclusively for verified Bishkek university students.',
      goToLogin: 'Sign In / Sign Up',
      errorMissingPhoto: 'Please select or capture a photo of your item.',
      errorMissingFields: 'Please fill in item title, price, and safe meetup spot.',
      publishSuccess: 'Your listing is live on the campus feed!',
    },
    meetupModal: {
      title: 'Propose Meetup',
      subtitle: 'Zero prepayment — inspect in person before paying',
      safeZoneLabel: 'Campus Safe Zone',
      timeLabel: 'Preferred time between classes',
      times: ['11:45 (Break)', '14:10 (After class)', '16:30 (Afternoon)', 'Flexible'],
      paymentLabel: 'Payment at meetup',
      payments: ['Cash (сом)', 'MBank / Optima'],
      offerLabel: 'Your offer price (сом)',
      messageLabel: 'Message to seller',
      messagePlaceholder: 'Hi! Can I pick this up today between classes at the lobby?',
      submitCta: 'Send Meetup Request',
      submitting: 'Sending request...',
      successTitle: 'Meetup Request Sent!',
      successDesc: 'The seller will see your meetup proposal in their My Page and confirm.',
      doneBtn: 'Done',
      loginNeeded: 'Please sign in first to propose a meetup.',
    },
    profile: {
      signInTab: 'Login',
      signUpTab: 'Sign Up',
      welcomeTitle: 'Student Account',
      welcomeSub: 'Sign in or register with your Bishkek university details',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      nicknameLabel: 'Nickname',
      nicknamePlaceholder: 'e.g., Aibek',
      universityLabel: 'University',
      majorLabel: 'Major / Year',
      majorPlaceholder: 'e.g., Computer Science, 3rd Year',
      signInBtn: 'Sign In',
      signUpBtn: 'Create Student Profile',
      signingIn: 'Signing in...',
      signingUp: 'Creating profile...',
      signOutBtn: 'Sign Out',
      myListingsTab: 'My Listings',
      meetupsTab: 'Meetups',
      noListings: 'You have not posted any listings yet.',
      createFirstListing: 'Post Your First Item',
      noMeetups: 'No meetup requests yet.',
      deleteListing: 'Delete',
      statusPending: 'Pending',
      statusAccepted: 'Accepted',
      statusDeclined: 'Declined',
      acceptBtn: 'Accept',
      declineBtn: 'Decline',
      buyerLabel: 'Buyer',
      sellerLabel: 'Seller',
      configBannerTitle: 'Connect Supabase',
      configBannerDesc: 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables to enable live auth, database queries, and photo uploads.',
      showSqlBtn: 'View Supabase SQL Schema',
      hideSqlBtn: 'Hide SQL Schema',
      copySqlBtn: 'Copy SQL',
      sqlCopied: 'SQL copied!',
      checkEmailConfirm: 'Account created! If email confirmation is enabled in Supabase, check your inbox or sign in.',
    },
    safeZones: [
      'KNU Library Lobby (Main Building)',
      'AUCA Cafeteria (1st Floor)',
      'Manas Gate 1 Checkpoint',
      'KRSU Main Building Lobby',
    ],
  },
};
