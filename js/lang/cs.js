var _Paletton_Strings = {

    error: {
        dispatchURLNotAvailable: 'Omlouváme se, tato stránka není momentálně dostupná.'
    },

    app: {
        confirmOldUID: 'Vaše URL obsahuje kód palety z předchozí verze aplikace. Chcete otevřít předchozí verzi a tuto paletu zobrazit?',
        confirmoldUIDImported: 'xxx',
        confirmoldUIDFail: 'xxx',
        btnOK: 'OK',
        btnCancel: 'Zrušit',
        btnClose: 'Zavřít',
        btnUndo: 'Zpět',
        btnRedo: 'Znovu',
        btnReset: 'Výchozí',
        btnMore: {
            btn: 'Další info',
            list: {
                about: 'O barevných schématech',
                versions: 'Historie verzí',
                linkFB: 'Paletton na Facebooku',
                linkTW: 'Paletton na Twitteru',
                linkGplus: 'Paletton na Google+'
            }
        },
        btnHue: {
            btn: 'Odstín',
            title: 'Barevný odstín',
            text: 'Zadejte odstín ručně, je to číslo od 0 do 360',
            opposite: 'protilehlý'
        },
        btnDist: {
            btn: 'Odstup',
            title: 'Odstup/Úhel',
            text: 'Zadejte vzdálenost vedlejších barev ručně, je to číslo od 0 do 180',
            def: 'výchozí'
        },
        btnRGB: {
            btn: 'Základní RGB',
            title: 'Základní barva',
            text: 'Zadejte hexadecimální kód základní barvy (000000–FFFFFF)'
        },
        btnShare: {
            btn: 'Sdílet paletu'
        },
        btnLike: {
            text: 'Líbí se vám to?'
        },

        header: {
            api: {
                btn: 'Paletton Live Colorizer',
                desc: 'Paletton Live Colorizer vám umožňuje použít technologii Paletton na vašem vlastním webu.'
            },
            mobile: {
                btn: 'Mobilní',
                desc: 'Mobilní aplikace nejsou dosud k dispozici, jejich vývoj se připravuje.'
            },
            more: {
                btn: 'More apps',
                desc: 'Další verze nejsou dosud k dipozici, jejich vývoj se připravuje.'
            },
            scheduled: 'plánuje se'
        },

        footer: {
            copy: 'Milujeme barvy. Od roku 2002',
            versions: {
                prev: 'Minulá verze',
                history: 'Historie verzí'
            },
            links: {
                text: 'Sledujte Paletton na',
                linkFB: 'Facebooku',
                linkTW: 'Twitteru',
                linkGplus: 'Google+'
            }
        }
    },

    adjuster: {
        btn: 'Doladit',
        title: 'Doladit barvy',
        lblHue: 'Odstín',
        lblSat: 'Sytost',
        lblBri: 'Jas',
        lblCon: 'Kontrast'
    },

    color: {
        colors: 'Barvy',
        pri: 'Hlavní barva',
        sec: 'Vedlejší barva',
        compl: 'Doplňková barva',
        swap: 'Prohodit vedlejší barvy'
    },

    colorInfo: {
        title: 'Informace o barvě',
        lblHue: 'Odstín',
        lblLum: 'Luminosita',
        lblLumRel: 'Rel. luminosita',
        linkWCAG: 'dle WCAG',
        btnApply: 'Použít jako základní barvu'
    },

    colorList: {
        btn: 'Tabulky / Export',
        title: 'Tabulky barev & export',
        detail: {
            title: 'Seznam barev',
            sub: {
                html: {
                    title: 'jako HTML',
                    desc: 'Exportovat paletu jako soubor HTML, včetně CSS'
                },
                css: {
                    title: 'jako CSS',
                    desc: 'Exportovat paletu jako kaskádové styly CSS (Cascading Style Sheets)'
                },
                oklch: {
                    title: 'jako OKLCH CSS',
                    desc: 'Export moderního CSS s oklch() proměnnými a tonálními škálami'
                },
                tailwind: {
                    title: 'jako Tailwind Config',
                    desc: 'Export konfigurace Tailwind CSS tématu (stupně 50–950)'
                },
                dtcg: {
                    title: 'jako Design Tokens (JSON)',
                    desc: 'Export designových tokenů ve formátu W3C DTCG'
                },
                figma: {
                    title: 'jako Figma Tokens / Variables',
                    desc: 'Export tokenů pro Tokens Studio a proměnné Figma'
                },
                less: {
                    title: 'jako LESS',
                    desc: 'Exportovat paletu jako seznam mixinů (definicí barev) ve formátu LESS'
                },
                sass: {
                    title: 'jako SASS',
                    desc: 'Exportovat paletu jako seznam definicí barev ve formátu SASS'
                },
                xml: {
                    title: 'jako XML',
                    desc: 'Exportovat paletu jako soubor XML'
                },
                text: {
                    title: 'jako text',
                    desc: 'Exportovat paletu jako textový soubor'
                }
            }
        },
        simple: {
            title: 'Vzorkovníky',
            sub: {
                png: {
                    title: 'jako obrázek PNG',
                    desc: 'Exportovat paletu jako uložitelný PNG obrázek v různých velikostech'
                },
                svg: {
                    title: 'jako vektorové SVG (Figma)',
                    desc: 'Export vektorové palety pro vložení přímo do Figmy'
                },
                aco: {
                    title: 'jako ACO (Photoshop)',
                    desc: 'Exportovat paletu jako paletu pro Photoshop (soubor .ACO)'
                },
                gpl: {
                    title: 'jako GPL (Gimp)',
                    desc: 'Exportovat paletu jako paletu pro GIMP (soubor .GPL)'
                },
                sketch: {
                    title: 'jako Sketch Palette',
                    desc: 'Exportovat paletu jako paletu pro Sketch.app'
                },
                figma: {
                    title: 'jako Figma Tokens / Variables',
                    desc: 'Export tokenů pro Tokens Studio a proměnné Figma'
                }
            }
        },
        grid: {
            title: 'Barevná škála',
            sub: {
                html: {
                    title: 'jako HTML',
                    desc: 'Exportovat škálu jako soubor HTML'
                },
                png: {
                    title: 'jako obrázek PNG',
                    desc: 'Exportovat škálu jako uložitelný PNG obrázek'
                }
            }
        },
        contrast: {
            title: 'Kombinace barev',
            desc: 'Čím vyšší číslo, tím vyšší kontrast vybraných dvou barev.',
            filter: {
                btn: 'Min. kontrast',
                title: 'Filtrovat minimální kontrast barev',
                text: '<p>Zadejte číslo 0-21 pro zvýraznění kombinací barev s vyšším kontrastem. Zadejte 0 pro vypnutí filtru.</p><p>Přijatelný kontrast: 2<br>Vyžadováno WCAG pro velké prvky: 3<br>Vyžadováno WCAG pro drobný text: 4.5</p>'
            }
        },
        tonal: {
            title: 'Tonální škály (50…950)',
            desc: '11-stupňové perceptuální škály (50…950) v prostoru OKLCH s přirozeným posunem odstínu.'
        }
    },

    convert: {
        btn: 'Simulace vidění',
        btnOn: 'Simulace aktivní',
        list: {
            'none': {
                title: 'Žádná simulace',
                desc: ''
            },
            'colorblind': {
                title: 'Simulace barvosleposti',
                sub: {
                    'protanope': {
                        title: 'Protanopie <i>(1 % of mužů)</i>',
                        desc: 'Protanopie je vážná porucha barevného vidění způsobená úplnou absencí červených fotoreceptorů na sítnici. Je to forma dichromatismu, při níž subjekt dokáže vnímat pouze světlo o vlnové délce 400 až 650nm, namísto obvyklých 700nm. Čistou červenou nevidí, jeví se mu jako černá; purpurové a fialové odstíny nedokáže odlišit od modrých; červené barvy s oranžovým nádechem se budou jevit jako tlumená žlutá. Všechny odstíny od oranžové přes žluté po zelenou s příliš dlouhou vlnovou délkou, aby stimulovaly receptory modré, se budou jevit jako podobné odstíny žluté barvy. Tato vada je dědičná, vázaná na pohlaví a vyskytuje se přibližně u 1 % mužů.'
                    },
                    'deuteranope': {
                        title: 'Deuteranopie <i>(1 % of mužů)</i>',
                        desc: 'Deuteranopie je porucha barevného vidění, při níž na sítnici chybí zelené fotoreceptory, což poměrně ovlivňuje rozlišování odstínů červené-zelené. Je to forma dichromatismu, při níž jsou přítomny pouze dva pigmenty čípků. Je dědičná a vázaná na pohlaví.'
                    },
                    'tritanope': {
                        title: 'Tritanopie <i>(vzácná, asi 0,003 % populace)</i>',
                        desc: 'Tritanopie je velmi vzácná porucha barevného vidění, při níž jsou přítomny pouze dva pigmenty čípků a úplná absence receptorů modré. Modré barvy se jeví zelenavé, žluté a oranžové se jeví narůžověle a purpurové a fialové barvy jsou vnímány jako temně rudé. Má souvislost s chromozomem "7".'
                    },
                    'protanomaly': {
                        title: 'Protanomálie <i>(1 % of mužů)</i>',
                        desc: 'Protanomálie je mírnější porucha barevného vidění, při níž změněná spektrální citlivost červených receptorů na sítnici (blíže k reakci zelených receptorů) způsobuje horší rozlišování červených a zelených odstínů. Tato vada je dědičná, vázaná na pohlaví a vyskytuje se přibližně u 1 % mužů.'
                    },
                    'deuteranomaly': {
                        title: 'Deuteranomálie <i>(5 % of mužů, 0.4 % of žen)</i>',
                        desc: 'Deuteranomálie, která je způsobena změněnou spektrální citlivostí zelených receptorů na sítnici, je zdaleka nejběžnější poruchou barevného vidění, mírně ovlivňující rozlišování červených a zelených odstínů u 5 %  evropských mužů. Je dědičná a vázaná na pohlaví.'
                    },
                    'tritanomaly': {
                        title: 'Tritanomálie <i>(velmi vzácná)</i>',
                        desc: 'Tritanomálie je vzácná, dědičná porucha barevného vidění, ovlivňující rozlišování modro-zelených a žluto-červených odstínů. Narozdíl od ostatních forem není dědičnost pohlavně vázaná a má souvislost s chromozomem "7".'
                    },
                    'dyschromatope': {
                        title: 'Dyschromatopsie (částečná achromatopsie)',
                        desc: ''
                    },
                    'achromatope': {
                        title: 'Úplná achromatopsie (neschopnost vnímat barvy)',
                        desc: ''
                    }
                }
            },
            'desaturate': {
                title: 'Odbarvení',
                sub: {
                    'grayhalf': {
                        title: 'Malá sytost',
                        desc: ''
                    },
                    'gray90': {
                        title: 'Téměř šedá',
                        desc: ''
                    },
                    'gray': {
                        title: 'Odstíny šedé',
                        desc: ''
                    }
                }
            },
            'gamma': {
                title: 'Simulace gamma',
                sub: {
                    'gamma-low': {
                        title: 'Zesvětlení: Přepálený LED displej / bledý inkoustový tisk',
                        desc: ''
                    },
                    'gamma-high': {
                        title: 'Ztmavení: Starý CRT monitor / hutný laserový tisk',
                        desc: ''
                    }
                }
            },
            'webcolor': {
                title: 'Web Colors (216-barevná paleta starých prohlížečů)',
                desc: ''
            }
        }
    },

    examples: {
        btn: 'Ukázky',
        title: 'Ukázky použití palety',
        grid: {
            title: 'Paleta',
            sub: {
                'grid': {
                    title: 'Tabulka odstínů',
                    desc: ''
                }
            }
        },
        web: {
            title: 'Rozložení stránky',
            sub: {
                'webl': {
                    title: 'Pozitivní design',
                    desc: ''
                },
                'webd': {
                    title: 'Negativní design',
                    desc: ''
                },
                'webw': {
                    title: 'Bílá stránka',
                    desc: ''
                },
                'webb': {
                    title: 'Tmavá stránka',
                    desc: ''
                }
            }
        },
        uifw: {
            title: 'UI Frameworky',
            sub: {
                'tw': {
                    title: 'Tailwind / shadcn',
                    desc: 'Komponenty Tailwind CSS a shadcn/ui'
                },
                'm3': {
                    title: 'Material Design 3',
                    desc: 'Dynamické tonální palety Material You a M3'
                },
                'antd': {
                    title: 'Ant Design',
                    desc: 'Podnikové dashboardy a komponenty Ant Design'
                },
                'boot': {
                    title: 'Bootstrap 5',
                    desc: 'Komponenty Bootstrap'
                },
                'fom': {
                    title: 'Fomantic-UI',
                    desc: 'Komponenty Fomantic-UI'
                }
            }
        },
        pic: {
            title: 'Kresba',
            sub: {
                'glo': {
                    title: 'Noční odlesky',
                    desc: ''
                },
                'glo2': {
                    title: 'Cákance',
                    desc: ''
                },
                'shtr': {
                    title: 'Exploze střepů',
                    desc: ''
                },
                'flwr': {
                    title: 'Náhodné květy',
                    desc: ''
                },
                'tart': {
                    title: 'Tartanová látka',
                    desc: ''
                }
            }
        },
        anim: {
            title: 'Animované',
            sub: {
                'blob': {
                    title: 'Bublání',
                    desc: ''
                },
                'stripes': {
                    title: 'Pruhy',
                    desc: ''
                }
            }
        }
    },

    model: {
        addCompl: 'přidat doplňkovou',
        list: {
            mono: {
                full: 'Monochromatický',
                short: 'Monochromatický',
                desc: '1 barva'
            },
            monocompl: {
                full: 'Monochromatický + doplněk',
                short: 'Monochromatický',
                desc: '2 barvy'
            },
            analog: {
                full: 'Sousedící barvy',
                short: 'Sousedící',
                desc: '3 barvy'
            },
            analogcompl: {
                full: 'Sousedící barvy + doplněk',
                short: 'Sousedící',
                desc: '4 barvy'
            },
            triad: {
                full: 'Triáda',
                short: 'Triáda',
                desc: '3 barvy'
            },
            triadcompl: {
                full: 'Triáda + doplněk',
                short: 'Triáda',
                desc: '4 barvy'
            },
            tetrad: {
                full: 'Tetráda',
                short: 'Tetráda',
                desc: '4 barvy'
            },
            free: {
                full: 'Libovolně',
                short: 'Libovolně',
                desc: 'Držte Shift pro přesun jednotlivých barev'
            }
        }
    },

    palette: {
        label: 'Moje paleta',
        copied: 'Zkopírováno',
        format: 'Formát',
        img: {
            title: 'Uložit paletu jako obrázek',
            label: 'Obrázek palety'
        }
    },

    preset: {
        btn: 'Předvolby',
        list: {
            'pale-light': {
                title: 'Nejsvětlejší pastelové'
            },
            'pastels-bright': {
                title: 'Jasné pastelové'
            },
            'shiny': {
                title: 'Zářivé'
            },
            'pastels-lightest': {
                title: 'Světlé bledě pastelové'
            },
            'pastels-very-light': {
                title: 'Světlé pastelové'
            },
            'full': {
                title: 'Plné barvy'
            },
            'pastels-light': {
                title: 'Střední bledě pastelové'
            },
            'pastels-med': {
                title: 'Střední pastelové'
            },
            'darker': {
                title: 'Tmavší barvy'
            },
            'pastels-mid-pale': {
                title: 'Bledé pastelové'
            },
            'pastels': {
                title: 'Pastelové'
            },
            'dark-neon': {
                title: 'Tmavý neon'
            },
            'pastels-dark': {
                title: 'Tmavší bledě pastelové'
            },
            'pastels-very-dark': {
                title: 'Tmavší pastelové'
            },
            'dark': {
                title: 'Tmavé'
            },
            'pastels-mid-dark': {
                title: 'Tmavé bledě pastelové'
            },
            'pastels-darkest': {
                title: 'Tmavé pastelové'
            },
            'darkest': {
                title: 'Temně syté'
            },
            'almost black': {
                title: 'Nejtmavší šedivé'
            },
            'almost-gray-dark': {
                title: 'Tmavé šedivé'
            },
            'almost-gray-darker': {
                title: 'Středně tmavé šedivé'
            },
            'almost-gray-mid': {
                title: 'Středně světlé šedivé'
            },
            'almost-gray-lighter': {
                title: 'Světlejší šedivé'
            },
            'almost-gray-light': {
                title: 'Nejsvětlejší šedivé'
            }
        }
    },

    preview: {
        btn: 'Náhled',
        list: {
            'uimock': {
                title: 'UI Mockup',
                desc: 'Dashboard s sémantickými rolemi barev'
            },
            'def': {
                title: 'Výchozí',
                desc: ''
            },
            'deftxt': {
                title: 'Výchozí + text',
                desc: ''
            },
            'alt': {
                title: 'Alternativní',
                desc: ''
            },
            'alttxt': {
                title: 'Alternativní + text',
                desc: ''
            },
            'circ': {
                title: 'Kruhy',
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
                title: 'Mondrianovská mozaika',
                desc: ''
            },
            'mond0': {
                title: 'Mondrianovská mozaika (prázdná)',
                desc: ''
            }
        }
    },

    random: {
        btn: 'Náhodně',
        title: 'Generátor a profily',
        btn00: 'Podobná',
        btn01: 'Podobné barvy, odlišný styl',
        btn10: 'Odlišné barvy, podobný styl',
        btn11: 'Odlišná',
        btnWcagAA: 'WCAG AA<small>kontrast ≥ 4.5:1</small>',
        btnWcagAAA: 'WCAG AAA<small>kontrast ≥ 7.0:1</small>',
        btnKeepMood: 'Zachovat styl<small>rotace barev, styl a kontrast beze změn</small>',
        btnVariations: 'Variace<small>jemný posun odstínu a sytosti</small>',
        btnFixContrastAA: 'Opravit kontrast AA<small>úprava na ≥ 4.5:1</small>',
        btnFixContrastAAA: 'Opravit kontrast AAA<small>úprava na ≥ 7.0:1</small>',
        btnSaveFav: '★ Do oblíbených',
        btnViewFavs: '📂 Uložené palety',
        favTitle: 'Oblíbené palety',
        favEmpty: 'Zatím žádné uložené palety. Klikněte na «★ Do oblíbených» pro uložení.',
        favDelete: 'Smazat',
        favApply: 'Použít paletu',
        contrastPassed: 'Kontrast splněn',
        contrastWarning: 'Nízký kontrast',
        profilesTitle: 'Designérské profily',
        harmoniesTitle: 'Režimy generování',
        harmoniesGroup: 'Harmonie (7 režimů)',
        styleGroup: 'Kontrast a styl (5 režimů)',
        tempGroup: 'Teplota (2 režimy)',
        regenPrimary: '↻ Jen primární',
        regenSecondary: '↻ Jen akcenty',
        locksTitle: 'Selektivní generování a zámky',
        actionsTitle: 'Chytrý generátor'
    },

    variator: {
        info: {
            shiftText: 'Držte Shift pro přesun jednotlivých odstínů'
        }
    }

};
