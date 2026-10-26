/**
 * Demo chord sheets for local/dev. Lyrics/chords of famous songs are third-party
 * copyrighted material — not owned by this project. See LEGAL.md / LEGAL_NOTICE.
 * Public builds: set VITE_INCLUDE_SEEDS=false (default remains true for now).
 *
 * @type {import('@/stores/songs').Song[]}
 */
export const seedSongs = [
  {
    id: 'seed-kino-gruppa-krovi',
    title: 'Группа крови',
    artist: 'Кино (Виктор Цой)',
    artistSlug: 'kino',
    songSlug: 'gruppa-krovi',
    key: 'Am',
    strumPattern: '↓ ↑ ↓ ↑',
    chords: `Вступление: Am C Dm E

Куплет 1:
Am              C
Тёплое место, но улицы ждут
Dm              E
Отпечатков наших ног.
Am              C
Мягкое кресло, клетчатый плед,
Dm              E
Не нажатый вовремя курок.

Припев:
Am
Группа крови на рукаве,
C
Мой порядковый номер на рукаве,
Dm
Пожелай мне удачи в бою,
E
Пожелай мне
Am
Не остаться в этой траве,
C
Не остаться в этой траве,
Dm
Пожелай мне удачи,
E              Am
Пожелай мне удачи.`,
    tabs: `e|--0-----0-----1-----0--|
B|--1-----1-----3-----0--|
G|--2-----0-----2-----1--|
D|--2-----2-----0-----2--|
A|--0-----3-----x-----2--|
E|--x-----x-----x-----0--|
   Am     C     Dm    E`,
    notes: 'Упрощённый вариант без баррэ — удобно для начинающих.',
    updatedAt: Date.parse('2026-10-23'),
  },
  {
    id: 'seed-kino-kukushka',
    title: 'Кукушка',
    artist: 'Кино (Виктор Цой)',
    artistSlug: 'kino',
    songSlug: 'kukushka',
    key: 'Am',
    strumPattern: '↓ ↑ ↓ ↑',
    chords: `Вступление:
Am C G G }x4

Куплет 1:
Am
Песен, ещё ненаписанных, сколько?
G               Dm
Скажи, кукушка, пропой.
Am
В городе мне жить или на выселках,
G               Dm
Камнем лежать или гореть звездой?
Am
Звездой.

Припев:
G  F  Am
Солнце моё — взгляни на меня,
G  F  Am
Моя ладонь превратилась в кулак,
G  F  Am
И если есть порох — дай огня.
G  F  Am
Вот так…`,
    tabs: '',
    notes: '',
    updatedAt: Date.parse('2026-10-23'),
  },
  {
    id: 'seed-kino-zvezda',
    title: 'Звезда по имени Солнце',
    artist: 'Кино (Виктор Цой)',
    artistSlug: 'kino',
    songSlug: 'zvezda-po-imeni-solntse',
    key: 'Am',
    strumPattern: '↓ ↓ ↑ ↑ ↓ ↑',
    chords: `Вступление: Am F C G

Куплет 1:
Am              F
Белый снег, серый лёд
C               G
На растрескавшейся земле.
Am              F
Одеялом лоскутным её стелет,
C               G
Город в дорожной петле.

Куплет 2:
Am              F
А над городом плывут облака,
C               G
Закрывая небесный свет.
Am              F
А над городом — жёлтый дым,
C               G
Городу две тысячи лет.

Припев:
Am       F
Живут странные люди —
C        G
Люди в домах.
Am       F
И сидят у огня,
C        G
И не видят огня.`,
    tabs: '',
    notes: 'Классическая прогрессия Am–F–C–G.',
    updatedAt: Date.parse('2026-10-27'),
  },
  {
    id: 'seed-kino-pachka',
    title: 'Пачка сигарет',
    artist: 'Кино (Виктор Цой)',
    artistSlug: 'kino',
    songSlug: 'pachka-sigaret',
    key: 'Am',
    strumPattern: '↓ ↑ ↓ ↑',
    chords: `Куплет:
Am              Dm
Я сижу и смотрю в чужое небо из чужого окна
G               C
И не вижу ни одной знакомой звезды.
Am              Dm
Я ходил по всем дорогам и туда, и сюда,
G               E
Обернулся — и не смог разглядеть следы.

Припев:
Am              F
Но если есть в кармане пачка сигарет,
C               G
Значит, всё не так уж плохо на сегодняшний день.
Am              F
И билет на самолёт с серебристым крылом,
C               E              Am
Что, взлетая, оставляет земле лишь тень.`,
    tabs: '',
    notes: '',
    updatedAt: Date.parse('2026-10-27'),
  },
  {
    id: 'seed-nautilus-goodby',
    title: 'Прощальное письмо',
    artist: 'Наутилус Помпилиус',
    artistSlug: 'nautilus-pompilius',
    songSlug: 'proshchalnoe-pismo',
    key: 'Am',
    strumPattern: '↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑',
    chords: `Куплет 1:
Am              F
Гудбай, Америка, о,
C               G
Где я не буду никогда.
Am              F
Прощай навсегда —
C               E
Возьми банджо, играй уходя.

Куплет 2:
Am              F
Я узнал, что у меня
C               G
Есть огромная семья —
Am              F
И тропический лес,
C               E
И кусты амброзии.

Припев:
Am       F       C       G
Гудбай, Америка, о,
Am       F       C       E
Где я не буду никогда.`,
    tabs: '',
    notes: 'Известна также как «Гудбай, Америка».',
    updatedAt: Date.parse('2026-10-27'),
  },
  {
    id: 'seed-nautilus-krylya',
    title: 'Крылья',
    artist: 'Наутилус Помпилиус',
    artistSlug: 'nautilus-pompilius',
    songSlug: 'krylya',
    key: 'Em',
    strumPattern: '↓ ↓ ↑ ↑ ↓ ↑',
    chords: `Куплет:
Em              C
Оставаясь на острие атаки
G               D
Тех, кто слева, тех, кто справа —
Em              C
Ты не видишь, как ветер срывает
G               D
С деревьев последние тряпки.

Припев:
Em       G
Эти крылья не мои —
C        D
Я всего лишь примерил их на себя.
Em       G
Эти крылья не мои —
C        D       Em
Я всего лишь играю.`,
    tabs: '',
    notes: '',
    updatedAt: Date.parse('2026-10-27'),
  },
  {
    id: 'seed-ddt-chto',
    title: 'Что такое осень',
    artist: 'ДДТ',
    artistSlug: 'ddt',
    songSlug: 'chto-takoe-osen',
    key: 'Am',
    strumPattern: '↓ ↑ ↓ ↑',
    chords: `Куплет 1:
Am              Dm
Что такое осень — это небо,
G               C
Плачущее небо под ногами.
Am              Dm
В лужах разлетаются птицы с облаками.
E               Am
Осень, я давно с тобою не был.

Припев:
F               C
Осень — в небо кострами звезда рвётся.
Dm              Am
Осень — мне бы прощения у судьбы просить.
F               C
Осень — люди по привычке жгут дома.
E               Am
И в небесах сжигают корабли.`,
    tabs: '',
    notes: '',
    updatedAt: Date.parse('2026-10-27'),
  },
  {
    id: 'seed-zemlyane-trava',
    title: 'Трава у дома',
    artist: 'Земляне',
    artistSlug: 'zemlyane',
    songSlug: 'trava-u-doma',
    key: 'Em',
    strumPattern: '↓ ↓ ↑ ↑ ↓ ↑',
    chords: `Куплет:
Em              C
Здравствуй, мама, не плачь,
G               D
Я не приеду весной.
Em              C
Здравствуй, мама, не жди —
G               D
Я вернусь не такой.

Припев:
Em              C
А трава у дома всё такая же,
G               D
И заботы те же, и родные стены.
Em              C
Только я уже не тот мальчишка,
G               D       Em
Что ушёл когда-то в дальние края.`,
    tabs: '',
    notes: '',
    updatedAt: Date.parse('2026-10-27'),
  },
  {
    id: 'seed-mashina-povory',
    title: 'Повороты',
    artist: 'Машина времени',
    artistSlug: 'mashina-vremeni',
    songSlug: 'povoroty',
    key: 'Am',
    strumPattern: '↓ ↑ ↓ ↑',
    chords: `Куплет:
Am              Dm
Вот опять над крышей дома твоего
G               C
Проплывает небо голубое.
Am              Dm
И опять не видно ничего,
E               Am
Что могло бы сделать нас с тобою.

Припев:
F               C
Повороты, повороты —
Dm              Am
Крутит, крутит шар земной.
F               C
Повороты, повороты —
E               Am
Неизвестно, что где что.`,
    tabs: '',
    notes: '',
    updatedAt: Date.parse('2026-10-27'),
  },
  {
    id: 'seed-oasis-wonderwall',
    title: 'Wonderwall',
    artist: 'Oasis',
    artistSlug: 'oasis',
    songSlug: 'wonderwall',
    key: 'Em',
    strumPattern: '↓ ↓ ↑ ↑ ↓ ↑',
    chords: `Вступление: Em G D A }x2

Куплет:
Em              G
Today is gonna be the day
D                    A
That they're gonna throw it back to you.
Em                 G
By now you should've somehow
D                    A
Realized what you gotta do.
Em                    G
I don't believe that anybody
D              A
Feels the way I do about you now.

Припев:
C               D
And all the roads we have to walk are winding,
Em              G
And all the lights that lead us there are blinding.
C               D
There are many things that I
   G        D/F#     Em
Would like to say to you but I don't know how.

C     D     Em
Because maybe
C              D            Em
You're gonna be the one that saves me?
C     D     Em
And after all
C      D      Em
You're my wonderwall.`,
    tabs: '',
    notes: 'Упрощённо: Em G D A / C D Em. D/F# можно брать как D.',
    updatedAt: Date.parse('2026-10-27'),
  },
  {
    id: 'seed-radiohead-creep',
    title: 'Creep',
    artist: 'Radiohead',
    artistSlug: 'radiohead',
    songSlug: 'creep',
    key: 'G',
    strumPattern: '↓ ↓ ↑ ↑ ↓ ↑',
    chords: `Вступление / Куплет:
G               B
When you were here before,
C               Cm
Couldn't look you in the eye.
G               B
You're just like an angel,
C               Cm
Your skin makes me cry.

G               B
You float like a feather
C               Cm
In a beautiful world.
G               B
I wish I was special,
C               Cm
You're so fuckin' special.

Припев:
G        B
But I'm a creep,
C        Cm
I'm a weirdo.
G              B
What the hell am I doing here?
C              Cm
I don't belong here.`,
    tabs: '',
    notes: 'B и Cm — баррэ; можно капо на 1-й и играть F# A# B Bm от G.',
    updatedAt: Date.parse('2026-10-27'),
  },
  {
    id: 'seed-dylan-knockin',
    title: "Knockin' on Heaven's Door",
    artist: 'Bob Dylan',
    artistSlug: 'bob-dylan',
    songSlug: 'knockin-on-heavens-door',
    key: 'G',
    strumPattern: '↓ ↓ ↑ ↑ ↓ ↑',
    chords: `Куплет:
G               D
Mama, take this badge off of me
Am              G
I can't use it anymore.
G               D
It's gettin' dark, too dark to see
C               G
I feel I'm knockin' on heaven's door.

Припев:
G               D
Knock, knock, knockin' on heaven's door
Am              G
Knock, knock, knockin' on heaven's door
G               D
Knock, knock, knockin' on heaven's door
C               G
Knock, knock, knockin' on heaven's door.`,
    tabs: '',
    notes: 'G–D–Am–C — один из самых простых бой-стандартов.',
    updatedAt: Date.parse('2026-10-27'),
  },
  {
    id: 'seed-beatles-let-it-be',
    title: 'Let It Be',
    artist: 'The Beatles',
    artistSlug: 'the-beatles',
    songSlug: 'let-it-be',
    key: 'C',
    strumPattern: '↓ ↓ ↑ ↑ ↓ ↑',
    chords: `Куплет:
C               G
When I find myself in times of trouble
Am              F
Mother Mary comes to me
C               G
Speaking words of wisdom,
F      C/E  Dm  C
Let it be.

C               G
And in my hour of darkness
Am                 F
She is standing right in front of me
C               G
Speaking words of wisdom,
F      C/E  Dm  C
Let it be.

Припев:
Am          G
Let it be, let it be,
F           C
Let it be, let it be.
C               G
Whisper words of wisdom,
F      C/E  Dm  C
Let it be.`,
    tabs: '',
    notes: 'C/E можно упростить до C.',
    updatedAt: Date.parse('2026-10-27'),
  },
  {
    id: 'seed-eagles-hotel',
    title: 'Hotel California',
    artist: 'Eagles',
    artistSlug: 'eagles',
    songSlug: 'hotel-california',
    key: 'Am',
    strumPattern: '↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑',
    chords: `Куплет:
Am              E
On a dark desert highway,
G               D
Cool wind in my hair.
F               C
Warm smell of colitas,
Dm              E
Rising up through the air.

Am              E
Up ahead in the distance,
G               D
I saw a shimmering light.
F               C
My head grew heavy and my sight grew dim,
Dm              E
I had to stop for the night.

Припев:
F               C
Welcome to the Hotel California.
E               Am
Such a lovely place (such a lovely place).
F               C
Plenty of room at the Hotel California.
Dm              E
Any time of year (any time of year).`,
    tabs: '',
    notes: 'Упрощённый куплет Am–E–G–D–F–C–Dm–E.',
    updatedAt: Date.parse('2026-10-27'),
  },
  {
    id: 'seed-nirvana-smells',
    title: 'Smells Like Teen Spirit',
    artist: 'Nirvana',
    artistSlug: 'nirvana',
    songSlug: 'smells-like-teen-spirit',
    key: 'F',
    strumPattern: '↓ ↓ ↓ ↓',
    chords: `Рифф / Куплет (power):
F               Bb
Load up on guns, bring your friends
Ab              Db
It's fun to lose and to pretend
F               Bb
She's over-bored and self-assured
Ab              Db
Oh no, I know a dirty word

Припев:
F    Bb   Ab   Db
Hello, hello, hello, how low
F    Bb   Ab   Db
Hello, hello, hello, how low
F    Bb   Ab   Db
Hello, hello, hello, how low
F    Bb   Ab   Db
Hello, hello, hello

F               Bb
With the lights out, it's less dangerous
Ab              Db
Here we are now, entertain us
F               Bb
I feel stupid and contagious
Ab              Db
Here we are now, entertain us`,
    tabs: '',
    notes: 'Баррэ F–Bb–Ab–Db; часто играют power-аккордами.',
    updatedAt: Date.parse('2026-10-27'),
  },
  {
    id: 'seed-coldplay-yellow',
    title: 'Yellow',
    artist: 'Coldplay',
    artistSlug: 'coldplay',
    songSlug: 'yellow',
    key: 'G',
    strumPattern: '↓ ↓ ↑ ↑ ↓ ↑',
    chords: `Куплет:
G
Look at the stars,
D
Look how they shine for you,
C
And everything you do.
C
Yeah, they were all yellow.

G
I came along,
D
I wrote a song for you,
C
And all the things you do.
C
And it was called Yellow.

Припев:
G               D
So then I took my turn —
C
Oh what a thing to have done —
C               G
And it was all yellow.`,
    tabs: '',
    notes: 'G–D–C на капо 2 = оригинал в A.',
    updatedAt: Date.parse('2026-10-27'),
  },
  {
    id: 'seed-queen-bohemian',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    artistSlug: 'queen',
    songSlug: 'bohemian-rhapsody',
    key: 'Bb',
    strumPattern: '↓ ↑ ↓ ↑',
    chords: `Баллада (упрощённо):
Bb
Is this the real life?
Bb
Is this just fantasy?
Eb
Caught in a landslide,
F
No escape from reality.
Bb              Gm
Open your eyes, look up to the skies and see.
Cm              F
I'm just a poor boy, I need no sympathy.
Bb      F       Gm      F       Eb      Bb
Because I'm easy come, easy go, little high, little low.
F
Any way the wind blows doesn't really matter to me, to me.

Bb
Mama, just killed a man,
Bb              Eb
Put a gun against his head,
Eb              F
Pulled my trigger, now he's dead.
Bb              Gm
Mama, life had just begun,
Cm                       F
But now I've gone and thrown it all away.`,
    tabs: '',
    notes: 'Сильно упрощённый фрагмент баллады для начинающих.',
    updatedAt: Date.parse('2026-10-27'),
  },
  {
    id: 'seed-john-lennon-imagine',
    title: 'Imagine',
    artist: 'John Lennon',
    artistSlug: 'john-lennon',
    songSlug: 'imagine',
    key: 'C',
    strumPattern: '↓ ↓ ↑ ↑ ↓ ↑',
    chords: `Куплет:
C               Cmaj7  F
Imagine there's no heaven
C               Cmaj7  F
It's easy if you try
C               Cmaj7  F
No hell below us
C               Cmaj7  F
Above us only sky

F               Am
Imagine all the people
Dm              F
Living for today, ah

Припев:
F               G
You may say I'm a dreamer
C               E         F
But I'm not the only one
F               G
I hope someday you'll join us
C               E         F  C
And the world will be as one`,
    tabs: '',
    notes: 'Cmaj7 можно заменить на C.',
    updatedAt: Date.parse('2026-10-27'),
  },
]
