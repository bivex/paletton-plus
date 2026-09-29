var _Paletton_Strings = {

    error: {
        dispatchURLNotAvailable: 'К сожалению, эта страница сейчас недоступна.'
    },

    app: {
        confirmOldUID: 'Ваш URL содержит код палитры из предыдущей версии приложения. Хотите открыть предыдущую версию, чтобы отобразить палитру?',
        confirmoldUIDImported: 'Color Scheme Designer импортировал палитру из предыдущей версии. Хотите открыть её? В противном случае вы вернётесь в старую версию приложения.',
        confirmoldUIDFail: 'Color Scheme Designer не может импортировать палитру из предыдущей версии. Начать со стандартной палитры? В противном случае старая версия попытается открыть палитру.',
        btnOK: 'ОК',
        btnCancel: 'Отмена',
        btnClose: 'Закрыть',
        btnUndo: 'Назад',
        btnRedo: 'Вперёд',
        btnReset: 'Сброс',
        btnMore: {
            btn: 'Подробнее',
            list: {
                about: 'О цветовых схемах',
                versions: 'История версий',
                linkFB: 'Paletton в Facebook',
                linkTW: 'Paletton в Twitter',
                linkGplus: 'Paletton в Google+'
            }
        },
        btnHue: {
            btn: 'Тон',
            title: 'Цветовой тон',
            text: 'Введите оттенок вручную (число от 0 до 360)',
            opposite: 'противоположный'
        },
        btnDist: {
            btn: 'Угол',
            title: 'Расстояние / Угол',
            text: 'Введите угол дополнительных цветов (число от 0 до 180)',
            def: 'по умолч.'
        },
        btnRGB: {
            btn: 'Базовый RGB',
            title: 'Базовый цвет',
            text: 'Введите HEX-код базового цвета (000000–FFFFFF)'
        },
        btnShare: {
            btn: 'Поделиться палитрой'
        },
        btnLike: {
            text: 'Нравится?'
        },

        header: {
            api: {
                btn: 'Paletton Live Colorizer',
                desc: 'Paletton Live Colorizer позволяет использовать движок Paletton в ваших проектах.'
            },
            mobile: {
                btn: 'Мобильное приложение',
                desc: 'Мобильное приложение пока в разработке.'
            },
            more: {
                btn: 'Другие приложения',
                desc: 'Плагины и расширения находятся в разработке.'
            },
            scheduled: 'в планах'
        },

        footer: {
            copy: 'Создано с любовью к цветам. С 2002 года',
            versions: {
                prev: 'Предыдущая версия',
                history: 'История версий'
            },
            links: {
                text: 'Мы в соцсетях:',
                linkFB: 'Facebook',
                linkTW: 'Twitter',
                linkGplus: 'Google+'
            }
        }
    },

    adjuster: {
        btn: 'Тонкая настройка',
        title: 'Настройка параметров палитры',
        lblHue: 'Тон',
        lblSat: 'Насыщенность',
        lblBri: 'Яркость',
        lblCon: 'Контраст'
    },

    color: {
        colors: 'Цвета',
        pri: 'Основной цвет',
        sec: 'Дополнительный цвет',
        compl: 'Комплементарный цвет',
        swap: 'Поменять местами доп. цвета'
    },

    colorInfo: {
        title: 'Параметры цвета',
        lblHue: 'Тон',
        lblLum: 'Яркость',
        lblLumRel: 'Относ. яркость',
        linkWCAG: 'по WCAG',
        btnApply: 'Использовать как базовый'
    },

    colorList: {
        btn: 'Таблицы / Экспорт',
        title: 'Таблицы цветов и экспорт',
        detail: {
            title: 'Список цветов',
            sub: {
                html: {
                    title: 'как HTML',
                    desc: 'Экспорт палитры в виде HTML-файла со стилями CSS'
                },
                css: {
                    title: 'как CSS',
                    desc: 'Экспорт палитры в формате таблицы стилей CSS'
                },
                oklch: {
                    title: 'как OKLCH CSS',
                    desc: 'Экспорт современного CSS с oklch() переменными и тональными шкалами'
                },
                tailwind: {
                    title: 'как Tailwind Config',
                    desc: 'Экспорт конфигурации темы Tailwind CSS (ступени 50–950)'
                },
                dtcg: {
                    title: 'как Design Tokens (JSON)',
                    desc: 'Экспорт дизайн-токенов в стандартном формате W3C DTCG'
                },
                figma: {
                    title: 'в Figma Tokens / Variables',
                    desc: 'Экспорт токенов для Tokens Studio и Figma Variables'
                },
                less: {
                    title: 'как LESS',
                    desc: 'Экспорт списка миксинов палитры для LESS'
                },
                sass: {
                    title: 'как SASS',
                    desc: 'Экспорт списка переменных палитры для SASS'
                },
                xml: {
                    title: 'как XML',
                    desc: 'Экспорт палитры в формате XML'
                },
                text: {
                    title: 'как текст',
                    desc: 'Экспорт палитры в виде простого текстового файла'
                }
            }
        },
        simple: {
            title: 'Цветовые образцы',
            sub: {
                png: {
                    title: 'как PNG-картинка',
                    desc: 'Экспорт палитры в PNG-изображения различных размеров'
                },
                svg: {
                    title: 'в векторный SVG (Figma)',
                    desc: 'Экспорт векторной палитры для вставки прямо в Figma'
                },
                aco: {
                    title: 'как ACO (Photoshop)',
                    desc: 'Экспорт палитры образцов для Adobe Photoshop (.ACO)'
                },
                gpl: {
                    title: 'как GPL (GIMP)',
                    desc: 'Экспорт палитры образцов для GIMP (.GPL)'
                },
                sketch: {
                    title: 'как палитра Sketch',
                    desc: 'Экспорт в палитру для Sketch.app'
                },
                figma: {
                    title: 'в Figma Tokens / Variables',
                    desc: 'Экспорт токенов для Tokens Studio и Figma Variables'
                }
            }
        },
        grid: {
            title: 'Цветовая сетка',
            sub: {
                html: {
                    title: 'как HTML',
                    desc: 'Экспорт сетки в HTML-файл'
                },
                png: {
                    title: 'как PNG-картинка',
                    desc: 'Экспорт сетки в файл PNG'
                }
            }
        },
        contrast: {
            title: 'Сочетания цветов',
            desc: 'Чем выше число, тем больше контраст между сочетаемыми цветами.',
            filter: {
                btn: 'Мин. контраст',
                title: 'Фильтр минимального контраста',
                text: '<p>Введите число от 0 до 21 для выделения контрастных комбинаций. Введите 0 для отключения фильтра.</p><p>Приемлемый контраст: 2<br>Требование WCAG для крупных элементов: 3<br>Требование WCAG для мелкого текста: 4.5</p>'
            }
        },
        tonal: {
            title: 'Тональные шкалы (50…950)',
            desc: '11-ступенчатые перцептивные шкалы (50…950) в пространстве OKLCH с плавным гармоничным сдвигом оттенка.'
        }
    },

    convert: {
        btn: 'Симуляция зрения',
        btnOn: 'Симуляция включена',
        list: {
            'none': {
                title: 'Без симуляции (нормальное)',
                desc: ''
            },
            'colorblind': {
                title: 'Нарушения цветовосприятия (дальтонизм)',
                sub: {
                    'protanope': {
                        title: 'Протанопия <i>(1 % мужчин)</i>',
                        desc: 'Протанопия — тяжёлая форма дефицита цветового зрения, вызванная полным отсутствием колбочковых фоторецепторов красного цвета.'
                    },
                    'deuteranope': {
                        title: 'Дейтеранопия <i>(1 % мужчин)</i>',
                        desc: 'Дейтеранопия — форма дальтонизма, при которой отсутствуют рецепторы зелёного цвета спектра.'
                    },
                    'tritanope': {
                        title: 'Тританопия <i>(редко, ~0.003% населения)</i>',
                        desc: 'Тританопия — редкое нарушение, характеризующееся отсутствием синих колбочек. Синий кажется зеленоватым, а жёлтый — розоватым.'
                    },
                    'protanomaly': {
                        title: 'Протаномалия <i>(1 % мужчин)</i>',
                        desc: 'Протаномалия — частичная красно-зелёная цветовая слепота со сниженной чувствительностью к красному цвету.'
                    },
                    'deuteranomaly': {
                        title: 'Дейтераномалия <i>(5 % мужчин, 0.4 % женщин)</i>',
                        desc: 'Дейтераномалия — наиболее распространённый тип нарушения восприятия зелёного спектра.'
                    },
                    'tritanomaly': {
                        title: 'Тританомалия <i>(очень редко)</i>',
                        desc: 'Тританомалия — редкое частичное нарушение восприятия синей части спектра.'
                    },
                    'dyschromatope': {
                        title: 'Дисхроматопсия (частичная ахроматопсия)',
                        desc: ''
                    },
                    'achromatope': {
                        title: 'Полная ахроматопсия (черно-белое зрение)',
                        desc: ''
                    }
                }
            },
            'desaturate': {
                title: 'Обесцвечивание',
                sub: {
                    'grayhalf': {
                        title: 'Низкая насыщенность',
                        desc: ''
                    },
                    'gray90': {
                        title: 'Почти серый',
                        desc: ''
                    },
                    'gray': {
                        title: 'Оттенки серого (Grayscale)',
                        desc: ''
                    }
                }
            },
            'gamma': {
                title: 'Симуляция гаммы дисплея / печати',
                sub: {
                    'gamma-low': {
                        title: 'Осветление: блеклый экран или слабая печать',
                        desc: ''
                    },
                    'gamma-high': {
                        title: 'Затемнение: контрастный ЭЛТ или плотный лазер',
                        desc: ''
                    }
                }
            },
            'webcolor': {
                title: 'Безопасные веб-цвета (палитра из 216 цветов)',
                desc: ''
            }
        }
    },

    examples: {
        btn: 'Примеры',
        title: 'Примеры использования палитры',
        grid: {
            title: 'Палитра',
            sub: {
                'grid': {
                    title: 'Таблица оттенков',
                    desc: ''
                }
            }
        },
        web: {
            title: 'Макеты страниц',
            sub: {
                'webl': {
                    title: 'Светлый дизайн',
                    desc: ''
                },
                'webd': {
                    title: 'Тёмный дизайн',
                    desc: ''
                },
                'webw': {
                    title: 'Белая страница',
                    desc: ''
                },
                'webb': {
                    title: 'Чёрная страница',
                    desc: ''
                }
            }
        },
        uifw: {
            title: 'UI-фреймворки',
            sub: {
                'tw': {
                    title: 'Tailwind / shadcn',
                    desc: 'Компоненты Tailwind CSS и shadcn/ui'
                },
                'm3': {
                    title: 'Material Design 3',
                    desc: 'Динамические тональные палитры Material You и M3-компоненты'
                },
                'antd': {
                    title: 'Ant Design',
                    desc: 'Корпоративные дашборды и компоненты Ant Design'
                },
                'boot': {
                    title: 'Bootstrap 5',
                    desc: 'Компоненты и верстка Bootstrap'
                },
                'fom': {
                    title: 'Fomantic-UI',
                    desc: 'Компоненты Fomantic-UI / Semantic'
                }
            }
        },
        pic: {
            title: 'Иллюстрации',
            sub: {
                'glo': {
                    title: 'Огни ночного города',
                    desc: ''
                },
                'glo2': {
                    title: 'Всплеск красок',
                    desc: ''
                },
                'shtr': {
                    title: 'Осколочный взрыв',
                    desc: ''
                },
                'flwr': {
                    title: 'Цветочный узор',
                    desc: ''
                },
                'tart': {
                    title: 'Шотландская клетка (Тартан)',
                    desc: ''
                }
            }
        },
        anim: {
            title: 'Анимации',
            sub: {
                'blob': {
                    title: 'Пузыри',
                    desc: ''
                },
                'stripes': {
                    title: 'Полосы',
                    desc: ''
                }
            }
        }
    },

    model: {
        addCompl: 'добавить комплементарный',
        list: {
            mono: {
                full: 'Монохроматическая',
                short: 'Монохром',
                desc: '1 цвет'
            },
            monocompl: {
                full: 'Монохроматическая с комплементом',
                short: 'Монохром',
                desc: '2 цвета'
            },
            analog: {
                full: 'Смежные цвета',
                short: 'Смежные цвета',
                desc: '3 цвета'
            },
            analogcompl: {
                full: 'Смежные цвета с комплементом',
                short: 'Смежные цвета',
                desc: '4 цвета'
            },
            triad: {
                full: 'Триада',
                short: 'Триада',
                desc: '3 цвета'
            },
            triadcompl: {
                full: 'Триада с комплементом',
                short: 'Триада',
                desc: '4 цвета'
            },
            tetrad: {
                full: 'Тетрад',
                short: 'Тетрад',
                desc: '4 цвета'
            },
            free: {
                full: 'Свободный стиль',
                short: 'Свободный стиль',
                desc: 'Удерживайте Shift для независимого выбора'
            }
        }
    },

    palette: {
        label: 'Моя палитра',
        copied: 'Скопировано',
        format: 'Формат',
        img: {
            title: 'Скачать палитру как изображение',
            label: 'Изображение палитры'
        }
    },

    preset: {
        btn: 'Пресеты',
        list: {
            'pale-light': {
                title: 'Светлейшая бледная пастель'
            },
            'pastels-bright': {
                title: 'Яркая пастель'
            },
            'shiny': {
                title: 'Сияющий'
            },
            'pastels-lightest': {
                title: 'Очень светлая бледная пастель'
            },
            'pastels-very-light': {
                title: 'Очень светлая пастель'
            },
            'full': {
                title: 'Насыщенные цвета'
            },
            'pastels-light': {
                title: 'Светлая бледная пастель'
            },
            'pastels-med': {
                title: 'Светлая пастель'
            },
            'darker': {
                title: 'Более тёмные цвета'
            },
            'pastels-mid-pale': {
                title: 'Бледная пастель'
            },
            'pastels': {
                title: 'Пастель'
            },
            'dark-neon': {
                title: 'Тёмный неон'
            },
            'pastels-dark': {
                title: 'Тёмная бледная пастель'
            },
            'pastels-very-dark': {
                title: 'Тёмная пастель'
            },
            'dark': {
                title: 'Тёмный'
            },
            'pastels-mid-dark': {
                title: 'Глубокая бледная пастель'
            },
            'pastels-darkest': {
                title: 'Глубокая пастель'
            },
            'darkest': {
                title: 'Глубокие тёмные цвета'
            },
            'almost black': {
                title: 'Почти чёрный сероватый'
            },
            'almost-gray-dark': {
                title: 'Тёмный сероватый'
            },
            'almost-gray-darker': {
                title: 'Средне-тёмный сероватый'
            },
            'almost-gray-mid': {
                title: 'Средне-светлый сероватый'
            },
            'almost-gray-lighter': {
                title: 'Светлый сероватый'
            },
            'almost-gray-light': {
                title: 'Светлейший сероватый'
            }
        }
    },

    preview: {
        btn: 'Предпросмотр',
        list: {
            'uimock': {
                title: 'Макет интерфейса',
                desc: 'Панель управления с семантическими ролями цветов'
            },
            'def': {
                title: 'Стандартный',
                desc: ''
            },
            'deftxt': {
                title: 'Стандартный с текстом',
                desc: ''
            },
            'alt': {
                title: 'Альтернативный',
                desc: ''
            },
            'alttxt': {
                title: 'Альтернативный с текстом',
                desc: ''
            },
            'circ': {
                title: 'Круги',
                desc: ''
            },
            'csd3': {
                title: 'Color Scheme Designer v. 3',
                desc: ''
            },
            'csd2': {
                title: 'Color Scheme Generator v. 2',
                desc: ''
            },
            'csd1': {
                title: 'Color Scheme Generator v. 1',
                desc: ''
            },
            'mond': {
                title: 'Мозаика Мондриана',
                desc: ''
            },
            'mond0': {
                title: 'Мозаика Мондриана (пустая)',
                desc: ''
            }
        }
    },

    random: {
        btn: 'Случайно',
        title: 'Генератор и профили',
        btn00: 'Похожие цвета и стиль',
        btn01: 'Похожие цвета, другой стиль',
        btn10: 'Другие цвета, похожий стиль',
        btn11: 'Полностью случайно',
        btnWcagAA: 'WCAG AA<small>контраст ≥ 4.5:1</small>',
        btnWcagAAA: 'WCAG AAA<small>контраст ≥ 7.0:1</small>',
        btnKeepMood: 'Сохранить характер<small>смена цветов, стиль и контраст прежние</small>',
        btnVariations: 'Вариации<small>мягкий сдвиг оттенка и насыщенности</small>',
        btnFixContrastAA: 'Исправить контраст AA<small>подгонка под ≥ 4.5:1</small>',
        btnFixContrastAAA: 'Исправить контраст AAA<small>подгонка под ≥ 7.0:1</small>',
        btnSaveFav: '★ В избранное',
        btnViewFavs: '📂 Избранные палитры',
        favTitle: 'Избранные палитры',
        favEmpty: 'Нет сохраненных палитр. Нажмите «★ В избранное», чтобы сохранить текущую комбинацию.',
        favDelete: 'Удалить',
        favApply: 'Применить палитру',
        contrastPassed: 'Контраст соблюден',
        contrastWarning: 'Слабый контраст',
        profilesTitle: 'Профили дизайнеров',
        harmoniesTitle: 'Режимы генерации',
        harmoniesGroup: 'Гармонии (7 режимов)',
        styleGroup: 'Контраст и стиль (5 режимов)',
        tempGroup: 'Температура (2 режима)',
        regenPrimary: '↻ Только Primary',
        regenSecondary: '↻ Только акценты',
        locksTitle: 'Выборочная генерация и замки',
        actionsTitle: 'Умный рандомайзер'
    },

    variator: {
        info: {
            shiftText: 'Удерживайте Shift для перемещения отдельных оттенков'
        }
    }

};
