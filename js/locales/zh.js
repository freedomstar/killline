/**
 * 斩杀线生存 V2 - 中文语言包
 */

export const zh = {
    // ========== data.js 文本 ==========
    data: {
        // 配置文本 (Quotes & Tips)
        config: {
            endings: {
                financialFreedom: {
                    title: '财务自由',
                    subtitle: '你逃离了引力',
                    message: '你成功积累了足够的资本，逃离了必须出卖时间换取生存的陷阱。由存款产生的被动收入已经超过了你的生活开销。你终于可以停下来，去追求那些真正让你感到快乐的事物。或者，也许你只是换了一个更高层级的游戏场？'
                },
                bankrupt: {

                    title: '财务崩溃',
                    subtitle: '你的银行账户已清零',
                    message: '没有存款，没有收入，信用卡被冻结。你发现自己已经站在了斩杀线的边缘。在M国，破产只是坠落的开始。'
                },
                homeless: {
                    title: '无家可归',
                    subtitle: '你失去了最后的庇护所',
                    message: '从公寓到车里，从车里到街头。没有固定地址，你甚至无法填写求职申请。这就是M国梦的另一面。'
                },
                healthCollapse: {
                    title: '健康崩溃',
                    subtitle: '你的身体再也撑不住了',
                    message: '没有医保的日子里，你选择忽视每一个身体的警告。最终，急诊室的账单成为了压垮骆驼的最后一根稻草。'
                },
                mentalBreakdown: {
                    title: '精神崩溃',
                    subtitle: '你选择了放弃',
                    message: '日复一日的压力、焦虑和绝望。当精神防线彻底崩塌，你失去了继续战斗的意志。'
                },
                exhaustion: {
                    title: '精力耗尽',
                    subtitle: '你的身体发出了最后警告',
                    message: '长期的睡眠不足和过度劳累，你的身体终于罢工了。在倒下的那一刻，你还在想着明天的账单。'
                },
                survived: {
                    title: '幸存者',
                    subtitle: '你活过了一年',
                    message: '恭喜！你在M国的斩杀线上艰难地活了下来。但这真的是胜利吗？还是只是另一年的挣扎？'
                },
                debtSpiral: {
                    title: '死亡螺旋',
                    subtitle: '多米诺骨牌倒下了',
                    message: '从那笔付不起的修车费开始，一切都失控了。没有车导致迟到，迟到导致失业。没有收入，信用卡违约，房东驱逐。当你在街头醒来时，你明白了：贫穷不是一种状态，而是一个不断下坠的螺旋。系统中指控你"个人责任缺失"，但你知道，你只是运气不好。'
                }
            },
            tips: [
                '小贴士：在M国，一场阑尾手术可能花费 $30,000+',
                '小贴士：平均每个M国人距离破产只有2.5个月的存款',
                '小贴士：信用分数决定了你的人生选项',
                '小贴士：Uber司机没有任何福利保障',
                '小贴士：在某些州，雇主可以无理由解雇你',
                '小贴士：失业救济金通常只有工资的40%',
                '小贴士：咖啡可以暂时提神，但治不了根本问题',
                '小贴士：熬夜刷手机能让你快乐，代价是明天的精力'
            ],
            quotes: [
                '"努力工作就能成功" —— 某个从未被裁员的人',
                '"存三个月工资作为应急基金" —— 假设你付得起房租的话',
                '"医疗费用可以分期" —— 前提是你还有信用',
                '"M国梦对所有人开放" —— 使用条款和条件适用',
                '"失业是暂时的" —— 但房东不会等你',
                '"保持积极心态" —— 这不需要花钱',
                '"Work hard, play hard" —— 假设你有时间play的话',
                '"咖啡能解决一切" —— 除了你的银行账户'
            ]
        },
        // 保险计划名称
        insuranceNames: {
            employer_basic: '雇主基础计划',
            employer_premium: '雇主优选计划',
            marketplace_bronze: '市场铜牌计划',
            marketplace_silver: '市场银牌计划',
            marketplace_gold: '市场金牌计划',
            medicaid: 'Medicaid (白卡)',
            none: '裸奔 (无保险)',
        },
        // 保险计划描述
        insuranceDescriptions: {
            employer_basic: (cost, ded) => `公司付大头，但你还得掏$${cost}/月。免赔额涨到了$${ded}，并不轻松。`,
            employer_premium: (cost, ded) => `每个月$${cost}，但生病时能省不少心。`,
            marketplace_bronze: (cost, ded) => `保费便宜，但真的生病了你要先掏$${ded}。俗称"防破产险"。`,
            marketplace_silver: (cost, ded) => `一个月$${cost}，看病还得先掏$${ded}免赔额。这就是美国医疗。`,
            marketplace_gold: (cost, ded) => `每月$${cost}，好保险是用钱堆出来的。`,
            medicaid: '政府低收入保险。看病不花钱，但很多诊所不收，且排队极慢。',
            none: '赌一把自己的身体。一旦生大病，直接破产。',
        },
        // 车险名称
        carInsuranceNames: {
            liability: '半险 (Liability)',
            full_coverage: '全险 (Full Coverage)',
            none: '无车险',
        },
        // 车险描述
        carInsuranceDescriptions: {
            liability: '主要赔付对方。修自己车时可报销40%的维修费。',
            full_coverage: (ded) => `赔对方也赔自己。出事了只需付$${ded}免赔额。`,
            none: '省了保费。如果出事或被警察抓到，你就完了。',
        },
        // 租客保险描述
        rentersInsuranceDescription: (cost) => `每月$${cost}保平安。如果公寓失火或被盗，保险公司会赔钱。`,

        // 资产类型
        assetNames: {
            gold: '黄金',
            sp500: 'S&P500指数',
            tech_giant: '科技巨头ETF',
            energy: '能源板块ETF',
            btc: '比特币',
            eth: '以太坊',
            solana: 'Solana',
            meme_coin: '迷因币',
            biotech: '生物科技ETF',
            reit: '房地产信托',
        },
        assetUnits: {
            gold: '盎司',
            sp500: '股',
            tech_giant: '股',
            energy: '股',
            btc: '个',
            eth: '个',
            solana: '个',
            meme_coin: '个',
            biotech: '股',
            reit: '股',
        },
        assetDescriptions: {
            gold: '传统避险资产，市场恐慌时价格上涨',
            sp500: '跟踪美国500强公司，稳健型投资',
            tech_giant: '包含FAANG等科技龙头',
            energy: '石油、天然气相关公司',
            btc: '加密货币龙头，高波动高风险',
            eth: '智能合约平台，Web3基础设施',
            solana: '高性能公链，号称以太坊杀手',
            meme_coin: '极高风险，可能一夜暴富或归零',
            biotech: '创新药研发，不也是另一种赌博吗？',
            reit: '收租人的快乐，但对利息和房价敏感',
        },

        // 住房类型
        housing: {
            apartment: { name: '公寓', description: '标准的单身公寓，虽然不大但设施齐全。能提供良好的休息环境，是你在这座城市最后的尊严。' },
            cheapRoom: { name: '廉价房', description: '狭窄的合租房，隔音很差。隔壁的吵闹声让你难以入睡，但至少有个屋顶。' },
            car: { name: '车里', description: '后座就是你的床。时刻担心警察敲窗，冬冷夏热，腰酸背痛。' },
            homeless: { name: '流浪', description: '公园的长椅或桥洞。没有安全感，没有尊严，风餐露宿。' }
        },

        // 工作类型
        jobs: {
            fulltime: { name: '全职' },
            parttime: { name: '兼职' },
            gig: { name: '零工' },
            unemployed: { name: '待业' },
            fired: { name: '被裁' }
        },

        // 医疗系统
        medical: {
            minuteClinic: { name: '分钟诊所 (CVS/Walgreens)', desc: '便宜快捷，适合感冒发烧小毛病。' },
            urgentCare: { name: '急救中心 (Urgent Care)', desc: '不用预约，比急诊便宜，但要小心网外陷阱。' },
            pcp: { name: '家庭医生 (PCP)', desc: '正规治疗，费用合理，但必须等待。' },
            er: { name: '急诊室 (ER)', desc: '无论死活都收，只要你付得起账单。' },
            otc: { name: 'OTC 非处方药', desc: '碰运气，小病可能有效。' }
        },

        // 餐饮系统
        meals: {
            fastFood: { name: '快餐' },
            homeCook: { name: '自己做饭' },
            restaurant: { name: '高档餐厅' },
            skip: { name: '不吃/省钱' },
            convenience: { name: '便利店' }
        },

        // 午餐选项
        lunch: {
            bento: { name: '🍱 吃便当', hint: (cfg) => `精力+${cfg.energyEffect}，健康+${cfg.healthEffect}，精神+${cfg.mentalEffect}` },
            fastfood: { name: '🍔 买快餐', hint: (cfg) => `健康${cfg.healthEffect}，精神+${cfg.mentalEffect}，-$${cfg.cost}` },
            skip: { name: '🤐 不吃午饭', hint: (cfg) => `健康${cfg.healthEffect}，省钱` },
            business: { name: '🍽️ 商务宴请', hint: (cfg) => `-$${cfg.cost}，精神+${cfg.mentalEffect}，社交+${cfg.socialEffect}` },
            salad: { name: '🥗 轻食沙拉', hint: (cfg) => `-$${cfg.cost}，健康+${cfg.healthEffect}，精力+${cfg.energyEffect}` },
            sandwich: { name: '🥪 便利店三明治', hint: (cfg) => `-$${cfg.cost}，精力+${cfg.energyEffect}` },
            hospital_cafeteria: { name: '🏥 医院食堂', hint: (cfg) => `-$${cfg.cost}，健康+${cfg.healthEffect}，精力+${cfg.energyEffect}` }
        },

        // 健康状态
        healthStatus: {
            normal: { name: '正常' },
            cold: { name: '轻微感冒' },
            sick: { name: '重感冒' },
            critical: { name: '重病' }
        },

        // 市场新闻
        marketNews: {
            tech_earnings_beat: { title: '📈 科技巨头财报超预期', description: '梨子、巨硬季度营收创新高' },
            tech_layoffs: { title: '📉 硅谷爆发大规模裁员潮', description: '多家科技公司宣布裁员万人' },
            ai_breakthrough: { title: '🤖 AI技术重大突破', description: '新一代AI模型性能飙升' },
            oil_surge: { title: '⛽ OPEC宣布减产', description: '国际油价应声上涨' },
            green_energy: { title: '🌱 新能源法案通过', description: '传统能源股承压' },
            oil_discovery: { title: '🛢️ 发现大型油田', description: '能源股集体上涨' },
            crypto_etf_approved: { title: '🚀 比特币ETF获批', description: '机构资金涌入加密市场' },
            crypto_ban: { title: '🚫 某大国宣布禁止加密货币', description: '全球币圈恐慌性抛售' },
            meme_frenzy: { title: '🐕 马X克发X暗示迷因币', description: '迷因币价格暴涨' },
            exchange_hack: { title: '🔓 大型交易所遭黑客攻击', description: '用户资产安全受威胁' },
            eth_upgrade: { title: '⚡ 以太坊完成重大升级', description: 'Gas费大幅降低' },
            fed_rate_hike: { title: '🏦 美联储宣布加息', description: '利率上调25个基点' },
            fed_rate_cut: { title: '🏦 美联储宣布降息', description: '货币政策转向宽松' },
            inflation_spike: { title: '📊 通胀数据创新高', description: 'CPI同比上涨超预期' },
            geopolitical_tension: { title: '🌍 地缘政治紧张加剧', description: '避险情绪升温' },
            peace_agreement: { title: '🕊️ 重大和平协议达成', description: '全球市场欢欣鼓舞' },
            market_rally: { title: '🎉 市场情绪乐观', description: '投资者信心高涨，股市全面上涨' },
            recession_fear: { title: '📉 经济衰退担忧加剧', description: '多项经济指标走弱' },
            job_report_strong: { title: '💼 非农就业数据强劲', description: '就业市场持续火热' },
            bank_crisis: { title: '🏦 银行业危机蔓延', description: '多家银行面临流动性问题' },

            // 新增
            fda_approval: { title: '💊 新药获FDA批准', description: '生物科技板块迎来重大利好' },
            drug_trial_fail: { title: '🧪 临床试验失败', description: '某明星药企股价腰斩，带崩板块' },
            housing_bubble_burst: { title: '🏠 房地产泡沫破裂', description: '房价暴跌，房贷违约率上升' },
            interest_rate_hike: { title: '📈 央行大幅加息', description: '为了抗通胀，借钱变得更贵了' },
            solana_network_outage: { title: '🔌 Solana网络宕机', description: '工程师正在紧急抢修，交易暂停' },
            defi_hack: { title: '💻 DeFi协议遭黑客攻击', description: '数亿美元资产被盗，币圈震惊' },
            pandemic_scare: { title: '🦠 新型病毒预警', description: '全球卫生组织发布警告，生物医药受关注' },
            trade_war: { title: '🚢 贸易战升级', description: '关税壁垒提高，全球供应链受阻' },
            election_year: { title: '🗳️ 大选年政策红利', description: '候选人承诺刺激经济，能源与国防受益' },
        },


        // 通勤选项
        commuteOptions: {
            car: { name: '🚗 开车', hint: (opt) => `剩余油量 ${opt.fuel || '?'}/${opt.capacity || '?'}` },
            bus: { name: '🚌 坐公交', hint: (opt) => `-$${opt.cost}，${opt.lateChance * 100}%概率迟到` },
            walk: { name: '🚶 步行', hint: (opt) => `健康+${opt.healthEffect}，必定迟到` },
            hospital_stay: { name: '🛌 住院', hint: (opt) => `安心静养` },
        },

        // 午餐条件提示
        lunch_hints: {
            not_prepared: '没有准备便当',
            sold_out: '今日售罄',
            restaurant_full: '餐厅爆满',
            too_expensive: (cost) => `余额不足 (需要$${cost})`,
        },

        // 通勤相关消息
        commute: {
            car: {
                name: '🚗 开车',
                hint: (fuelOrOpt, capacity) => {
                    const fuel = typeof fuelOrOpt === 'object' ? (fuelOrOpt.fuel ?? '?') : fuelOrOpt;
                    const tank = typeof fuelOrOpt === 'object' ? (fuelOrOpt.capacity ?? '?') : capacity;
                    return `剩余油量 ${fuel}/${tank}`;
                }
            },
            car_repair: { name: '🔧 修车后开车', hint: (cost, insuranceInfo) => `-$${cost} ${insuranceInfo}，必定迟到` },
            car_refuel: { name: '⛽ 加油并开车', hint: (cost) => `-$${cost}，加满油箱` },
            bus: {
                name: '🚌 坐公交',
                hint: (costOrOpt, chance) => {
                    const cost = typeof costOrOpt === 'object' ? (costOrOpt.cost ?? '?') : costOrOpt;
                    const lateChance = typeof costOrOpt === 'object'
                        ? Math.round((costOrOpt.lateChance ?? 0) * 100)
                        : chance;
                    return `-$${cost}，${lateChance}%概率迟到`;
                }
            },
            walk: {
                name: '🚶 步行',
                hint: (healthOrOpt) => {
                    const health = typeof healthOrOpt === 'object' ? (healthOrOpt.healthEffect ?? '?') : healthOrOpt;
                    return `健康+${health}，必定迟到`;
                }
            },
            too_expensive: (cost) => `余额不足 (需要$${cost})`,
            unavailable: '该选项当前不可用',
            hospital_stay: { name: '🛌 住院', hint: '安心静养' },
        },

        // 通勤结果消息
        commute_messages: {
            cost: (cost) => `车费 -$${cost}`,
            health: (health) => `健康 +${health}`,
            late: (energy, mental, progress) => `迟到了！精力-${energy}，精神-${mental}，任务进度-${progress}%`,
            pip: (score) => `PIP表现分 -${score}`,
        },

        // 时段名称
        periods: {
            day: { name: '白天', description: '08:00 - 18:00' },
            night: { name: '夜晚', description: '18:00 - 08:00' },
            deep_night: { name: '深夜', description: '00:00 - 08:00' },
        },

        // 住所类型
        housingTypes: {
            apartment: '公寓',
            cheapRoom: '廉价房',
            car: '车里',
            homeless: '流浪',
        },

        // 工作类型
        jobTypes: {
            fulltime: '全职',
            parttime: '兼职',
            gig: '零工',
            unemployed: '待业',
            fired: '被裁',
        },

        // 事件类型
        eventTypes: {
            layoff: '裁员风暴',
            bill: '账单到期',
            accident: '意外事件',
            opportunity: '机会来临',
            daily: '日常抉择',
            health: '健康问题',
            night: '夜间选择',
            work: '工作相关',
            system: '系统',
            bonus: '特殊奖励',
        },

        // 夜间选项
        night_choices: {
            sleep: { text: '好好睡觉', hint: (recovery) => `明天精力${recovery > 0 ? `+${recovery}` : recovery}` },
            phone: { text: '熬夜玩手机', hint: (mental, energyPenalty) => `+${mental}精神，明天精力${energyPenalty > 0 ? `+${energyPenalty}` : energyPenalty}` },
            phone_social: { text: '📞 给朋友打电话', hint: (social, mental, energyPenalty) => `+${social}社交，+${mental}精神，明天精力${energyPenalty > 0 ? `+${energyPenalty}` : energyPenalty}` },
            overtime: { text: '加班工作', hint: (money, mental, progress, energyPenalty) => `+$${money}，-${mental}精神，进度+${progress * 100}%，明天精力${energyPenalty > 0 ? `+${energyPenalty}` : energyPenalty}` },
            entertainment: { text: '🎉 出去放松', hint: (cost, mental, energyBonus) => `-$${cost}，+${mental}精神，明天精力${energyBonus > 0 ? `+${energyBonus}` : energyBonus}` },
            prepareMeal: { text: '🍳 准备明天的便当', hint: (ingredients, energyBonus, mental) => `-${ingredients}食材，+${mental}精神，明天精力${energyBonus > 0 ? `+${energyBonus}` : energyBonus}` },
            grocery: { text: '🛒 去超市采购食材', hint: (cost, ingredients, energyBonus) => `-$${cost}，+${ingredients}食材，明天精力${energyBonus > 0 ? `+${energyBonus}` : energyBonus}` },
        },

        // 精神恢复事件
        mental_restoration: {
            psychotherapy: {
                title: '心理咨询',
                description: '你决定寻求专业帮助。在这个疯狂的城市里，承认自己需要帮助是一种勇气。',
                hint: (cost, maxGain, gain) => `-$${cost}，精神上限+${maxGain}，精神+${gain}`,
                messages: {
                    tooPoor: '你也想看心理医生，但看了看银行余额，你觉得还是自己扛着吧。',
                    success: '治疗师的话让你意识到，那些压垮你的并不是重担本身，而是你背负它们的方式。(精神上限 +{0})'
                }
            },
            nature_retreat: {
                title: '逃离城市',
                description: '开车去最近的国家公园，关掉手机，只听风声和鸟鸣。',
                hint: (cost, energy, maxGain, gain) => `-$${cost}，精力-${energy}，精神上限+${maxGain}，精神+${gain}`,
                messages: {
                    tooPoor: '你想去旅行，但油费和住宿费让你打消了这个念头。',
                    success: '当你站在山顶俯瞰渺小的城市时，那些让你焦虑的KPI和账单似乎也变得微不足道了。(精神上限 +{0})'
                }
            },
            meditation_insight: {
                title: '顿悟时刻',
                description: '在深长的呼吸中，你突然想通了一直困扰你的问题。',
                choices: {
                    embrace: {
                        text: '拥抱这份平静',
                        hint: (gain) => `精神上限 +${gain}`
                    }
                },
                messages: {
                    success: '执念消散了，你的内心变得更加坚韧。(精神上限 +{0})'
                }
            },
            volunteer_work: {
                title: '社区志愿者',
                description: '参与食物银行的分发工作。看到那些比你更艰难的人依然在努力生活，你感到了一种力量。',
                hint: (energy, maxGain, social) => `精力-${energy}，精神上限+${maxGain}，社交+${social}`,
                messages: {
                    success: '帮助他人是治愈自己最好的方式。(精神上限 +{0})'
                }
            }
        },

        // 结局
        endings: {
            bankrupt: {
                title: '财务崩溃',
                subtitle: '你的银行账户已清零',
                message: '没有存款，没有收入，信用卡被冻结。你发现自己已经站在了斩杀线的边缘。在M国，破产只是坠落的开始。',
            },
            homeless: {
                title: '无家可归',
                subtitle: '你失去了最后的庇护所',
                message: '从公寓到车里，从车里到街头。没有固定地址，你甚至无法填写求职申请。这就是M国梦的另一面。',
            },
            healthCollapse: {
                title: '健康崩溃',
                subtitle: '你的身体再也撑不住了',
                message: '没有医保的日子里，你选择忽视每一个身体的警告。最终，急诊室的账单成为了压垮骆驼的最后一根稻草。',
            },
            mentalBreakdown: {
                title: '精神崩溃',
                subtitle: '你选择了放弃',
                message: '日复一日的压力、焦虑和绝望。当精神防线彻底崩塌，你失去了继续战斗的意志。',
            },
            exhaustion: {
                title: '精力耗尽',
                subtitle: '你的身体发出了最后警告',
                message: '长期的睡眠不足和过度劳累，你的身体终于罢工了。在倒下的那一刻，你还在想着明天的账单。',
            },
            survived: {
                title: '幸存者',
                subtitle: '你活过了365天',
                message: '恭喜！你在M国的斩杀线上艰难地活了下来。但这真的是胜利吗？还是只是另一年的挣扎？',
            },
            debtSpiral: {
                title: '死亡螺旋',
                subtitle: '多米诺骨牌倒下了',
                message: '从那笔付不起的修车费开始，一切都失控了。没有车导致迟到，迟到导致失业。没有收入，信用卡违约，房东驱逐。当你在街头醒来时，你明白了：贫穷不是一种状态，而是一个不断下坠的螺旋。系统中指控你"个人责任缺失"，但你知道，你只是运气不好。',
            },
        },

        // 讽刺标语
        sarcasmQuotes: [
            '"努力工作就能成功" —— 某个从未被裁员的人',
            '"存三个月工资作为应急基金" —— 假设你付得起房租的话',
            '"医疗费用可以分期" —— 前提是你还有信用',
            '"M国梦对所有人开放" —— 使用条款和条件适用',
            '"失业是暂时的" —— 但房东不会等你',
            '"保持积极心态" —— 这不需要花钱',
            '"Work hard, play hard" —— 假设你有时间play的话',
            '"咖啡能解决一切" —— 除了你的银行账户',
        ],

        // 每日小贴士
        dailyTips: [
            '小贴士：在M国，一场阑尾手术可能花费 $30,000+',
            '小贴士：平均每个M国人距离破产只有2.5个月的存款',
            '小贴士：信用分数决定了你的人生选项',
            '小贴士：Uber司机没有任何福利保障',
            '小贴士：在某些州，雇主可以无理由解雇你',
            '小贴士：失业救济金通常只有工资的40%',
            '小贴士：咖啡可以暂时提神，但治不了根本问题',
            '小贴士：熬夜刷手机能让你快乐，代价是明天的精力',
        ],

        // 医疗系统
        medicalSystem: {
            insuranceTypes: {
                employer: '雇主保险',
                medicaid: 'Medicaid',
                none: '无保险',
            },
            treatmentOptions: {
                minuteClinic: { name: '分钟诊所 (CVS/Walgreens)', description: '便宜快捷，适合感冒发烧小毛病。' },
                urgentCare: { name: '急救中心 (Urgent Care)', description: '不用预约，比急诊便宜，但要小心网外陷阱。' },
                pcp: { name: '家庭医生 (PCP)', description: '正规治疗，费用合理，但必须等待。' },
                er: { name: '急诊室 (ER)', description: '无论死活都收，只要你付得起账单。' },
                otc: { name: 'OTC 非处方药', description: '碰运气，小病可能有效。' },
            },
            healthStages: {
                normal: '健康',
                sick_minor: '身体不适',
                sick_moderate: '症状加重',
                sick_severe: '医疗紧急',
            },
        },

        // 伙食系统
        mealSystem: {
            fastFood: '快餐',
            homeCook: '自己做饭',
            restaurant: '高档餐厅',
            skip: '不吃/省钱',
            convenience: '便利店',
        },

        // 健康状态
        healthStatuses: {
            normal: '正常',
            cold: '轻微感冒',
            sick: '重感冒',
            critical: '重病',
        },

        // 神器 (Artifacts)
        artifacts: {
            dropshipping_bot: {
                name: '副业机器人',
                description: '每日收入+${0}，但因为各种客户投诉，每日精神 -{1}。',
                log: (income, mood) => `机器人处理了一些订单。收入+$${income}，精神-${mood}。`
            },
            mom_credit_card: {
                name: '神奇信用卡',
                description: '存款低于${1}时生效。所有消费减少 {0}%。',
                log: (subsidy) => `神奇信用卡。`
            },
            gopro_camera: {
                name: '运动相机',
                description: '记录你的每一次受伤。每次损失健康时获得 ${0}。医疗费用 x{1}倍。',
            },
            lucky_ring: {
                name: '幸运戒指',
                description: '任何概率事件的成功率提升 {0}%。精力消耗不变。',
            },
            coffee_drip: {
                name: '咖啡点滴',
                description: '精力锁定 ≥ {0}，永远不会归零透支。',
            },
            side_job_bot: {
                name: '副业机器人',
                description: '每次获得金钱时额外 +$${0}。',
            },
            gig_cap: {
                name: '奋斗者之帽',
                description: '所有消耗精力的行动，基础收益 +${0}。',
            },
            piggy_bank: {
                name: '存钱罐',
                description: '当天不花钱 → 金钱收益 +${0}。',
            },
            bull_plushie: {
                name: '牛市公仔',
                description: '当前每拥有 ${1}，金钱获取 +{0}%。',
            },
            grinder_tie: {
                name: '奋斗逼领带',
                description: '工作时精神 +{0}，健康损失 x{1}。',
            },
            blood_contract: {
                name: '卖血契约',
                description: '健康低于 {0}% 时，所有收益 x{1}。',
            },
            jammed_copier: {
                name: '卡纸复印机',
                description: '若今天工作与昨天相同，自动增加相同进度。',
            },
            intern_badge: {
                name: '实习生工牌',
                description: '抵消一次裁员，使用后消失（社交 -{0}）。',
            },
            leverage_jack: {
                name: '杠杆千斤顶',
                description: '投资收益 x{0}，亏损也 x{0}。',
            },
            insider_phone: {
                name: '内幕电话',
                description: '随机有 {0}% 几率接到 {1}% 准确的明日情报。（有冷却时间）',
            },
            golden_parachute: {
                name: '黄金降落伞',
                description: '资产跌幅超过 {0}% 时自动止损。',
            },
            actuary_glasses: {
                name: '精算师眼镜',
                description: '保险理赔不再被拒，网外就医视为网内，修车费用减半。',
            },
            wellness_tea: {
                name: '养生茶具',
                description: '每日恢复 {0} 点健康，{1} 点精神。',
                log: (health, mental) => `🍵 养生茶具：健康+${health}，精神+${mental}。`
            },
            neural_chip: {
                name: '神经植入体',
                description: '每日消耗 {0} 点健康，恢复 {1} 点精力，工作进度固定 +{2}%。',
                log: (health, energy) => `💾 神经植入体：健康-${health}，精力+${energy}。`
            },
            quantum_meditation_mat: {
                name: '量子冥想垫',
                description: '精神不仅仅是虚幻的。每恢复 {1} 点精神，同时恢复 {0} 点健康。',
            },
            streamer_mic: {
                name: '主播麦克风',
                description: '把你的情绪价值变现。每恢复 {1} 点精神，获得 ${0}。',
            },
            super_vitamin: {
                name: '超级维他命',
                description: '健康的身体带来健康的心灵。每恢复 {1} 点健康，同时恢复 {0} 点精神。',
            },
            stray_cat: {
                name: '流浪猫',
                description: '一只高冷的橘猫。虽然每天要花 ${0} 买猫粮，但它每天能治愈你 {1} 点精神。每 {2} 天额外自愈 {3} 点精神上限（最高增长至 {4}）。',
                log: (cost, mental) => `🐱 喂猫消耗 $${cost}，获得精神 +${mental}。`,
                log_max: (gain) => `🐱 猫咪若即若离的陪伴治愈了你的内心深处 (精神上限 +${gain})。`
            },
            rent_increase_bonus: {
                title: '🏠 租金溢价补偿',
                description: '虽然房租涨了，但房东为了安抚你，或者你在搬家/清理房间时发现了一些奇怪的古董...',
                choices: {
                    get: '获得新神器: {0}',
                    swap: '交换神器: {0} 变为 {1}',
                    skip: '不，谢谢 (保持现状)'
                },
                messages: {
                    get: '你获得了神器：{0}',
                    swap: '你用 {0} 交换了 {1}',
                    skip: '你决定不接受这份意外的馈赠。'
                }
            }
        },
    },

    finance: {
        debt: '债务',
        totalDebt: '总债务',
        pendingInstallment: '待结转分期',
        repay: '偿还',
        repaySuccess: (amount) => `成功偿还 $${amount}`,
        repayEmpty: '当前没有可偿还的债务',
        newDebtNotice: (amount, source) => `新增债务 $${amount} (${source})`,
        interestNotice: (amount) => `债务产生利息 $${amount}`,
        interest: '累计利息',
        medical: '医疗',
        commute: '通勤',
        daily: '日常',
        fine: '罚款',
        overflow: '超支',
        other: '其他',
        autoRepay: {
            title: '自动还款设置',
            enable: '启用每日自动还债',
            keepCash: '保留现金 (不用于还债)',
            maxDaily: '每日最大还款额 (0为不限)',
            tips: '系统将在每日结束时，利用闲置资金自动偿还债务，优先处理高息债务。你也可以随时打开主界面的存款卡片调整计划。',
            dailyLog: (amount, keepCash) => `🔄 自动还款 -$${amount} (保留现金 $${keepCash})`,
            setupPrompt: '你可以立即设置自动还款计划，后续也可在主界面存款卡片中随时调整。'
        },
        max: '最大',
        manualRepayTip: '(你可以随时手动还款)'
    },

    // ========== game.js 文本 ==========
    game: {
        // 任务名称列表
        taskNames: ['项目开发', '报告撰写', '数据分析', '客户方案', '系统维护', '代码审查'],

        // 交易消息
        trade: {
            systemError: '系统错误',
            invalidAsset: '无效的资产类型',
            insufficientFunds: '资金不足',
            insufficientHolding: '持仓不足',
            buySuccess: (quantity, unit, name, cost) => `成功买入 ${quantity} ${unit}${name}，花费 $${cost.toLocaleString()}`,
            sellSuccess: (quantity, unit, name, value, profitText) => `成功卖出 ${quantity} ${unit}${name}，获得 $${value.toLocaleString()}，${profitText}`,
            profit: (amount, percent) => `盈利 $${amount.toFixed(2)} (+${percent}%)`,
            loss: (amount, percent) => `亏损 $${Math.abs(amount).toFixed(2)} (${percent}%)`,
        },

        // 日志和消息
        log: {
            gameInit: (seed) => `[Game] 初始化, 种子: ${seed}`,
            newTask: (name, difficulty, deadline) => `[Game] 新任务: ${name}, 难度${difficulty}, 期限${deadline}天`,
            marketNews: (title, change) => `[Market News] ${title} | 情绪变化: ${change > 0 ? '+' : ''}${change}`,
            marketDenial: (assetName) => `[Market] 辟谣：关于 ${assetName} 的传闻已被官方否定，行情回归平稳。`,
            marketDefiance: (title) => `[Market] 🤯 市场无视了"${title}"的影响！走势完全相反！`,
            marketStatus: (sentiment, news) => `[Market] 情绪=${sentiment}, 新闻=${news || '无'}`,
            useCarCommute: (remaining, capacity) => `[Game] 使用汽车通勤，剩余油量 ${remaining}/${capacity}`,
            refuel: (cost, remaining, capacity) => `[Game] 加油 -$${cost}，剩余油量 ${remaining}/${capacity}`,
            repairCar: (cost) => `[Game] 修车 -$${cost}，故障修复，必定迟到`,
            bentoExpired: '[Game] 便当未食用，已过期',
            taskOverdue: (days, risk) => `[Game] 任务超时 ${days} 天, PIP风险: ${risk * 100}%`,
            lostEmployerInsurance: '[Game] 失去工作，雇主保险失效',
            gotEmployerInsurance: '[Game] 获得全职工作，自动加入雇主基础医保',
        },

        artifactTriggers: {
            side_job_bot: (bonus) => `🤖 副业机器人：+$${bonus}`,
            gig_cap: (bonus) => `🧢 奋斗者之帽：+$${bonus}`,
            gopro_camera: (reward) => `📹 运动相机：受伤赚钱 +$${reward}`,
            gopro_camera_medical: '📹 运动相机：医疗费用增加',
            bull_plushie: (percent) => `🐂 牛市公仔：收益 +${percent}%`,
            blood_contract: '📝 卖血契约：收益翻倍',
            grinder_tie: (mental) => `👔 奋斗逼领带：精神 +${mental}`,
            jammed_copier: (gain) => `🖨️ 卡纸复印机：额外进度 +${gain}%`,
            neural_chip: (gain) => `💾 神经植入体：额外进度 +${gain}%`,
            mom_credit_card: (info) => `💳 神奇信用卡：省下了 $${info}`,
            quantum_meditation_mat: (amount) => `🧘 量子冥想垫：健康 +${amount}`,
            streamer_mic: (amount) => `🎤 主播麦克风：收益 +$${amount}`,
            super_vitamin: (amount) => `💊 超级维他命：精神 +${amount}`,
        },

        artifactDaily: {
            piggy_bank: (bonus) => `🪙 存钱罐：今日零花费奖励 +$${bonus}`,
            insider_phone_tip: (assetName) => `📱 明日看涨 ${assetName}`,
            insider_phone_fine: (fine) => `📱 内幕电话：被罚款 -$${fine}`,
            insider_phone_detail: (assetName) => `据线报，${assetName} 预计将在明日迎来显著波动。`,
            ticker_insider_label: '[内幕情报]',
            ticker_rumor_label: '[传闻]',
            ticker_news_title: '市场新闻',
            modal_insider_title: '🔑 核心内幕',
            modal_news_title: '📰 市场新闻 (News)',
            modal_confirmed_badge: '已证实',
            modal_no_insider: '今日暂无内幕消息。',
            modal_no_news: '今日市场平稳，无重大新闻。',
            modal_news_sentiment: '市场情绪影响:',
            modal_rumor_title: '🔍 市场传闻 (Rumor)',
            modal_rumor_notice: (day) => `注意：该消息尚待证实，预计将在第 ${day} 天揭晓真相。`,
            golden_parachute: (assetName, price, proceeds) => `🪂 黄金降落伞：${assetName} 跌破警戒线，止损卖出 @$${price}，回收 $${proceeds}`,
        },

        // 财务报告
        finance: {
            fainting: (mentalPenalty, healthPenalty) => `⚠️ 精力彻底耗尽！你直接昏睡过去，身心受到永久创伤 (精神上限 -${mentalPenalty}, 健康上限 -${healthPenalty})`,
            socialIsolation: (penalty) => `⚠️ 长期与世隔绝正在吞噬你的精神 (精神 -${penalty})`,
            socialDeath: (healthPenalty, mentalPenalty) => `☠️ 社会性死亡！你感到被世界遗弃，身心全线崩溃 (健康 -${healthPenalty}, 精神 -${mentalPenalty})`,
            socialJobImpact: (penalty) => `📉 社交障碍导致工作效率暴跌 (效率 -${penalty})`,
            payday: (gross, net, tax) => `💰 发薪日：账面 $${gross} | 实到 $${net} (税-$${tax})`,
            rentPaid: (amount) => `🏠 支付房租：-$${amount}`,
            rentInsufficient: (amount) => `🏠 支付房租 (余额不足)：-$${amount}`,
            utilityPaid: (amount) => `💡 支付生活杂费：-$${amount}`,
            insurancePaid: (amount) => `🛡️ 支付保险月费: -$${amount}`,
            insurancePlanChanged: (name) => `📋 保险计划已变更为: ${name}`,
            carInsuranceChanged: (name) => `🚗 车险计划已变更为: ${name}`,
            rentersInsuranceActive: '🏠 租客保险已生效',
            rentersInsuranceCancelled: '🏠 租客保险已退订',
            waitingForDoctor: (damage) => `⏳ 等待医生中: 健康 -${damage}`,
            waitingSurgeryApproval: (damage) => `⏳ 等待手术审批: 健康 -${damage}`,
            medicaidApproved: '✅ 白卡申请通过！医疗费用现已全免。',
            medicaidDenied: '❌ 白卡申请被拒：资产或收入不符合条件。',
            emergencyMedical: (amount) => `🚑 紧急送医自付: -$${amount}`,
            investmentBoom: (percent, bonus) => `🚀 投资大涨 ${percent}%! 精神 +${bonus}`,
            investmentCrash: (percent, penalty) => `📉 投资暴跌 ${percent}%! 精神 -${penalty}`,
            chronicFatigue: (penalty) => `⚠️ 长期疲劳: 健康 -${penalty}`,
            severeOverwork: (penalty) => `⚠️ 严重透支: 健康 -${penalty}`,
            salaryIncrease: (amount, current) => `💰 绩效评估：工作表现优异，月薪上调了 $${amount} (现为 $${current})`,
            salaryNoIncrease: '💼 绩效评估：本月表现平平，薪资维持不变。',
            rentIncrease: (amount, current) => `🏠 市场波动：因市场行情变化，房租上涨了 $${amount} (现为 $${current})`,
        },

        // 预见未来提示 (仅提示)
        foreseeing: {
            rentWarning: (amount) => `⚠️ 预警：余额不足以支付明日房租 ($${amount})`,
            rentReminder: (days, amount) => `📌 房租 ${days} 天后到期：$${amount}`,
            utilityWarning: (amount) => `⚠️ 预警：余额不足以覆盖明日水电费 ($${amount})`,
            utilityReminder: (days, amount) => `📌 水电费 ${days} 天后到期：约 $${amount}`,
            insuranceWarning: (amount) => `⚠️ 预警：余额不足以支付明日保险费 ($${amount})`,
            insuranceReminder: (days, amount) => `📌 保险费 ${days} 天后到期：约 $${amount}`,
            insuranceChangeWindow: '📌 今天是本期保险变更的最后一天',
            pipOmen: '😶 老板今天脸色不太好，似乎在翻进度表',
            workMoodWarning: (base) => `${base}\n😶 老板今天的气压很低，最好把进度交代清楚。`,
            rumorLine: (text) => `💬 小道消息：${text}`,
            rumors: [
                '听说医疗系统要严查报销，近期最好别冒险。',
                '朋友说油价可能要涨，通勤成本会变高。',
                '圈内传闻科技板块要出大新闻，波动会加剧。',
                '听人说这周裁员风声紧，别惹领导。'
            ],
            eveningOmenUtility: (amount) => `今晚空气闷热，水电费可能要超支了 (当前约 $${amount})。`,
            eveningOmenMarket: (title) => `风声鹤唳：${title} 的传闻正在扩散。`,
            eveningOmenNoise: '小区附近有可疑的人影，今晚多留意门窗。',
            eveningOmenHot: '空气闷热得不正常，今晚可能难熬。',
            eveningOmenCold: '冷风异常刺骨，今晚恐怕要加大取暖。',
            eveningOmenWork: '工作群里安静得反常，老板可能在看进度表。',
            eveningOmenSocial: '朋友群里提到一点风声，明天可能不太平。',
            utilityShock: (delta) => `⛽ 油价冲击传导到生活成本：水电费 +$${delta}`,
            marketRumorTitle: (title) => `【传闻】${title}`,
            marketRumorDesc: (desc) => `${desc}\n(消息未证实，留意风险)`,
            marketConfirmTitle: (title) => `【实锤】${title}`,
            marketConfirmDesc: (desc) => `${desc}\n(市场开始兑现预期)`
        },

        // 医疗费用说明
        medical: {
            medicaidCoverage: '白卡全额报销',
            noInsurance: '无保险全额自付',
            outOfNetwork: '遭遇网外医生',
            denied: '保险公司判定非紧急拒赔',
            deniedBreakdown: (note) => `保险拒赔 (${note})`,
            outOfNetworkBreakdown: (base, final) => `网外设施全额自付 ($${base} -> $${final})`,
            deductible: (amount) => `免赔额: $${amount}`,
            coinsurance: (percent, amount) => `共保(${percent}%): $${Math.round(amount)}`,
            reachedAnnualMax: '已达年度上限，保险全包',
        },

        // 夜间选项结果消息
        nightResults: {
            sleep: (recovery) => `你睡了个好觉，明天将恢复 ${recovery} 点精力`,
            phone: '刷手机到深夜，心情变好了，但明天会很累',
            phone_social: '和朋友聊了很久，感觉不想那么孤独了，心情舒畅',
            overtime: (money, bonus) => `加班到深夜，赚了$${money}但身心俱疲${bonus}`,
            overtimeProgress: (progress, progressGain) => `，进度 +${progressGain}% (当前 ${progress}%)`,
            overtimeComplete: ' ✅ 任务完成！',
            entertainment: (cost) => `和朋友聚会到深夜，花了$${cost}但心情大好`,
            prepareMeal: '花了一些时间准备明天的便当，省钱又健康！',
            grocery: '去超市买了一周的食材，冰箱满满的',
        },

        // 状态描述
        status: {
            unknown: '未知',
        },

        // 存档系统
        save: {
            invalidSlot: (id) => `[Game] 无效的存档槽位: ${id}`,
            saved: (id) => `[Game] 游戏已保存到槽位 ${id}`,
            saveFailed: '[Game] 保存失败:',
            noSave: (id) => `[Game] 槽位 ${id} 没有存档`,
            loaded: (id, day) => `[Game] 已从槽位 ${id} 加载存档, 第 ${day} 天`,
            loadFailed: '[Game] 加载失败:',
            deleted: (id) => `[Game] 槽位 ${id} 存档已删除`,
            readFailed: (id) => `[Game] 读取存档槽 ${id} 失败:`,
        },
        housing: {
            pickTitle: '选择你的住所',
            pickSubtitle: '开局先选住所，再选择神器。',
            requestChange: '更换住所',
            cancelChange: '撤销申请',
            nextCycleEffective: '搬家申请已提交，下个周期生效',
            pendingTo: (name) => `搬家申请中：${name}`,
            changeCanceled: '已撤销搬家申请',
            moveCompleted: (name) => `搬家完成！新住所：${name}`,
            noAlternative: '暂无可选住所',
            insufficientCash: (required) => `现金不足：需要至少 $${required} 才能申请搬家`,
            insufficientCashShort: (required) => `至少需要 $${required}`
        }
    },

    ui_static: {
        help: {
            title: '📖 生存指南',
            goals_title: '🎯 游戏目标',
            goals_text: '活下去。保持<b>存款 > 0</b>，这是你唯一的安全网。',
            stats_title: '📊 核心指标',
            stats_energy: '<b>⚡ 精力</b>：行动的点数。无论工作还是摸鱼都需要消耗。耗尽则无法行动。',
            stats_mental: '<b>🧠 精神</b>：San值。过低会导致失眠、噩梦，甚至做出非理智决定。',
            stats_health: '<b>❤️ 健康</b>：身体是革命的本钱。低健康会引发医疗账单，也是最快的破产方式。',
            work_title: '💼 职场法则',
            work_text: '小心 PIP (绩效改进计划)。连续完不成任务或被发现摸鱼，都会累积风险。',
            work_quote: '"有时候，为了保住工作，你得牺牲点尊严，为了保住尊严，你得牺牲点存款。"',
            random_title: '🎲 随机性',
            random_text: '你可以输入特定<b>种子</b>来固定随机事件，或留空体验纯随机人生。',
        },
        start: {
            title: '斩杀线生存',
            subtitle: 'KILLZONE SURVIVOR',
            tagline: '"一次裁员，离流浪汉只有三个月"',
            intro_1: '你是一名硅谷科技公司的中产阶级员工。',
            intro_2: '存款看似充裕，生活看似稳定。',
            intro_3: '但M国梦的背后，是一条<span class="danger">隐形的斩杀线</span>。',
            intro_footer: '⚡ 管理你的精力 | 🧠 维持你的精神 | 💰 守住你的存款',
            start_btn: '开始游戏',
            seed_label: '世界线种子 (选填):',
            seed_placeholder: '留空则随机',
            help_label: '游戏说明',
            dev_tools: '🔧 开发者工具',
        },
        game_header: {
            day: (n) => `第 ${n} 天`,
            energy: '精力',
            mental: '精神',
            health: '健康',
            money: '存款',
            housing: '住所',
            job: '工作',
            social: '社交',
            work_efficiency: '工作能力',
        },
        finance: {
            housing: '🏠 居住',
            insurance: '🛡️ 保险',
            artifact: '神器',
            ingredients: '食材',
            monthly_bill: '月度账单',
            next_bill_days: (days) => `下个账单: ${days}天`,
            income: '月薪',
            task: '📋 工作任务',
            difficulty: '难度',
            meal: '便当',
            provision: '储备',
            wait: '天',
            prepared: '✅ 已备',
            not_prepared: '未备',
            ingredients_count: (count) => `食材: ${count}`,
            day_count: (days) => `${days}天`,
            overdue_days: (days) => `超时${days}天`,
            investment: '投资',
        },
        finance_detail: {
            title: '💼 财务详情',
            cash_title: '现金资产',
            noInvestments: '暂无持仓',
            noDebt: '暂无债务',
            repay_placeholder: '输入偿还金额'
        },
        bill_detail: {
            title: '🧾 账单详情',
            total_label: '总计:',
            rent: '🏠 房租',
            insurance: '🛡️ 保险',
            utility: '💡 水电生活费',
            due_in: (days) => `(剩 ${days} 天)`,
            due_today: '(今天到期!)',
        },
        tabs: {
            home: '生存',
            assets: '投资',
            insurance: '保险',
            status: '状态',
        },
        modals: {
            select_save: '📂 选择存档',
            save_game: '💾 保存游戏',
            cancel: '取消',
            confirm: '确定',
            artifact_select_title: '📦 选择你的初始神器',
            artifact_select_subtitle: '这就好比投胎技术活，选一个吧，它将决定你这次人生的画风。',
            artifact_select_action: '点击选择',
            dev_editor: '🔧 修改属性',
            message_history: '📜 历史消息',
            news_detail: '📰 市场情报',
        },
        dev_editor: {
            money: '存款 ($)',
            energy: '精力 (0-100)',
            mental: '精神 (0-100)',
            health: '健康 (0-100)',
            social: '社交 (0-100)',
            efficiency: '工作能力 (0-100)',
            ingredients: '食材 (个)',
            job: '工作状态',
            save_btn: '保存修改',
        },
        event: {
            advance_btn: '开始时间流逝',
            select_commute: '🚗 选择通勤方式：',
            select_lunch: '🍱 选择今日午餐策略：',
            select_daily_action: '✨ 顺带做点别的：',
            select_incident: '⚠️ 突发状况：',
        },
        status_page: {
            title: '📊 个人状态',
            save_mgmt: '💾 存档管理',
            save_btn: '保存游戏',
            return_btn: '返回标题',
            bio_stats: '🧬 生理指标',
            career: '💼 职业生涯',
            housing: '🏠 居住环境',
            commute: '🚗 交通通勤',
            finance: '💰 财务状况',
            survival: '📈 生存统计',
            dev_tools: '🔧 开发者工具',
            dev_check: '📋 事件一致性检查',
            dev_desc: '分析事件效果与描述是否一致',
            job_title: '当前职位',
            job_income: '月薪收入',
            work_efficiency: '💼 工作能力',
            social_val: '🤝 社交',
            days_survived: '存活天数',
            max_wealth: '最高资产',
            world_seed: '世界线种子',
            unemployed_days: '失业天数',
            pto_days: '带薪病假',
            housing_type: '住所类型',
            monthly_rent: '每月房租',
            recovery_effect: '恢复效果',
            commute_type: '通勤方式',
            weekly_gas: '每周油费',
            monthly_car_ins: '月车险',
            cash_balance: '现金余额',
            total_debt: '负债总额',
            credit_score: '信用评分',
        },
        insurance_page: {
            title: '保险管理中心',
            health_title: '🏥 健康保险',
            current_plan: '当前计划',
            monthly_premium: '月保费',
            deductible_label: '免赔额 (Deductible)',
            deductible_hint: '未达到免赔额前，需全额自付医疗费。',
            pending_change: '下月将自动变更为: ',
            change_plan_btn: '更换计划',
            car_title: '🚗 汽车保险',
            adjust_plan_btn: '调整方案',
            renters_title: '🏠 租客保险',
            status_label: '状态',
            buy_ins_btn: '购买保险',
        },
        assets_page: {
            title: '投资理财',
            sentiment_label: '市场情绪:',
            cash_label: '可用资金',
            portfolio_label: '持仓市值',
            total_assets_label: '总资产',
            tab_watchlist: '⭐ 自选',
            tab_gold: '黄金/大宗',
            tab_stock: '股票/ETF',
            tab_crypto: '加密货币',
            news_loading: '加载中...',
        },
        ending_screen: {
            title: '游戏结束',
            subtitle: '你被系统斩杀了',
            default_message: '在M国，中产阶级与流浪汉之间，只隔着一次裁员、一场大病、或一个意外。',
            restart_btn: '再次挑战',
            continue_btn: '继续游戏',
        },
        trade_modal: {
            buy_title: '买入',
            sell_title: '卖出',
            price_label: '当前价格:',
            holding_label: '当前持仓:',
            quantity_label: '交易数量:',
            quantity_placeholder: '输入数量',
            total_label: '预计金额:',
            cash_label: '可用现金:',
            confirm_btn: '确认交易',
            max_btn: '最大',
        },
        ending_stats: {
            days: '存活天数',
            money: '最终存款',
            housing: '最终住所',
            job: '工作状态',
            energy: '最终精力',
        },
    },

    // ========== ui.js 文本 ==========
    ui: {
        dayToast: {
            energyUnchanged: '⚡ 精力不变',
            energyRecovered: (delta) => `⚡ 精力恢复: ${delta}`,
            energyChanged: (delta) => `⚡ 精力变化: ${delta}`,
            mentalPart: (delta) => `精神 ${delta}`,
            healthPart: (delta) => `健康 ${delta}`,
            housingBonus: (parts) => `🏠 住所加成: ${parts}`,
            restDay: '🎉 休息日！好好享受吧',
            newDayNeutral: '☀️ 新的一天',
            newDayPositive: '🚀 充满希望的一天',
            newDayHard: '📉 艰难的一天',
            paydayIn: (days) => `距发薪 ${days} 天`,
            forcedSleep: '😵 体力透支，直接昏睡过去...'
        },
        side: {
            lunchLabel: '午餐',
            healthPlus: (value) => `健康 +${value}`,
            latePenalty: (energyPenalty, mentalPenalty) => `迟到了！精力-${energyPenalty}, 精神-${mentalPenalty}`,
            pipPenalty: (scorePenalty) => `PIP评分-${scorePenalty}`
        },
        messageHistory: {
            title: '历史消息',
            empty: '暂无消息记录 (仅记录最近 2 天)',
            dailySummary: '每日总结'
        },
        // Toast 消息
        toast: {
            seedCopied: '世界线种子已复制',
            copiedSuccess: '种子已复制',
            copyFailed: '复制失败，请手动复制',
            copyError: '复制失败',
            loadFailed: '加载失败',
            saveFailed: '保存失败',
            saveSuccess: (slotId) => `已保存到槽位 ${slotId}`,
            loadSuccess: (slotId) => `已加载槽位 ${slotId} 的存档`,
            newGameStarted: (slotId) => `新游戏已开始 (槽位 ${slotId})`,
            undoChangeRequest: '已撤销变更申请，维持当前计划',
            isCurrentPlan: '这是你当前的计划',
            isCurrentOption: '这是你当前的方案',
            changeSubmitted: (name) => `申请已提交: ${name} (下月生效)`,
            changeRevoked: '已撤销变更申请',
            nextMonthActive: '申请已提交，将于下月生效',
            assetLoadError: '资产数据加载失败',
            tradeInfoError: '交易信息错误',
            invalidQuantity: '请输入有效数量',
            gmSaved: 'GM数据已保存',
            socialLow: '⚠️ 社交值过低！如果不去社交，精神将会崩溃。',
            gameResumed: '你选择回到了残酷的世界',
        },

        artifacts: {
            title: '📦 我的神器',
            emptySlot: '[ 空插槽 ]',
            selectionTitle: '🃏 选择神器',
        },

        confirm: {
            returnToTitle: '确定返回标题？未保存的进度将丢失。',
            returnToTitleHeader: '返回标题',
            deleteSlot: (slotId) => `确定删除槽位 ${slotId} 的存档？`,
            deleteSlotHeader: '删除存档',
            defaultTitle: '确认操作',
            defaultMessage: '确定要执行此操作吗？',
        },

        // 模态框标题
        modal: {
            selectHealthPlan: '选择健康保险计划',
            selectCarPlan: '选择汽车保险方案',
            saveGame: '💾 保存游戏',
            loadGame: '📂 选择存档',
            buyAsset: '买入资产',
            sellAsset: '卖出资产',
            confirm: '确定',
            dev_editor: '🔧 修改属性',
            message_history: '📜 历史消息',
        },

        dev_editor: {
            money: '存款 ($)',
            energy: '精力 (0-100)',
            mental: '精神 (0-100)',
            health: '健康 (0-100)',
            social: '社交 (0-100)',
            efficiency: '工作能力 (0-100)',
            ingredients: '食材 (个)',
            job: '工作状态',
            save_btn: '保存修改',
        },

        // 保险页面
        insurance: {
            employerBadge: '雇主',
            personalBadge: '个人',
            insured: '✅ 已投保',
            uninsured: '❌ 未投保',
            cancelInsurance: '取消保险',
            buyInsurance: (premium) => `购买 ($${premium}/月)`,
            nextMonthActive: '生效',
            nextMonthCancel: '取消',
            pendingHint: (action) => `⏳ 下月${action}`,
            revokeChange: '(撤销变更)',
            pendingCarPlan: (name) => `⏳ 下月生效: ${name}`,
            nextMonthEffective: '⏳ 下月生效',
            premiumHint: '保费:',
            deductibleHint: '免赔:',
            coinsuranceHint: '共保:',
            healthPlanNotice: '⏳ <strong>下月生效</strong>：申请将于下一个账单日生效。在此之前维持原计划。',
            carPlanNotice: '⏳ <strong>下月生效</strong>：切换方案后，将于下一个账单日生效。维修费用按出险时的即时计划结算。',
        },

        // 存档页面
        save: {
            slot: (id) => `槽位 ${id}`,
            autoSlot: '自动存档',
            emptySlot: '空存档',
            day: (d) => `第${d}天`,
            continueBtn: '继续',
            newGameBtn: '新游戏',
            current: '(当前)',
            overwrite: '覆盖保存',
            saveHere: '保存到此',
            seedLabel: 'SEED:',
            noSeed: '无',
            copySeedTitle: '复制种子',
        },

        // 状态页面
        status: {
            unknown: '未知',
            noEffect: '无特殊效果',
            effectsTitle: '效果加成',
            close: '关闭',
            energyRec: '精力恢复',
            mental: '精神',
            health: '健康',
            energyRecovery: (v) => `精力恢复+${v}`,
            mentalBonus: (v) => `精神+${v}`,
            healthBonus: (v) => `健康+${v}`,
            privateCarLabel: '🚗 私家车',
            publicTransitLabel: '🚌 公共交通',
            commuteUses: (fuel, capacity) => `${fuel}/${capacity}次`,
            perMonthMoney: (amount) => `$${amount}/月`,
            dayCount: (days) => `${days}天`,
            ptoLabel: (days) => `PTO: ${days}天`,
            workEfficiency: '工作能力',
        },

        // 资产页面
        assets: {
            marketSentiment: '市场情绪:',
            sentimentNeutral: '中性',
            sentimentExtremeFear: '极度恐慌',
            sentimentFear: '恐慌',
            sentimentExtremeGreed: '极度贪婪',
            sentimentGreed: '贪婪',
            riskLevel: {
                low: '低风险',
                medium: '中风险',
                high: '高风险',
                extreme: '极高风险',
            },
            buy: '买入',
            sell: '卖出',
            holding: '持仓',
            value: '市值',
            profitLoss: '盈亏',
            avgCost: '均价',
            confirmBuy: '确认买入',
            confirmSell: '确认卖出',
            trend: '走势',
            favorite: '收藏',
            unfavorite: '取消收藏',
            todayPnl: '今日盈亏',
            totalPnl: '总盈亏',
            portfolioTrend: '综合收益走势',
            purchased: '已购买',
            favorited: '已收藏',
            noWatchlist: '暂无自选资产<br>请在其他分类中点击星号收藏',
            noHistory: '暂无足够历史数据',
            chartDaily: '日',
            chartWeekly: '周'
        },


        // 验证提示
        validation: {
            selectLunch: '午餐',
            selectAction: '额外行动',
            selectCommute: '通勤方式',
            selectIncident: '突发状况',
            pleaseSelectPrefix: '请先选择:',
            previewHint: (list) => `可预览。开始时间流逝前请先选择: ${list}`,
            pleaseComplete: '请先完成上方选择',
        },
    },

    // ========== events.js 文本 ==========
    events: {
        // 事件类型标签
        typeLabels: {
            work: '💼 工作',
            daily: '📋 日常',
            opportunity: '✨ 机会',
            health: '🏥 健康',
            accident: '⚠️ 意外',
            layoff: '💔 裁员',
            night: '🌙 夜晚',
            special: '⭐ 特殊',
        },

        // ====== 按事件 ID 组织的文本 ======

        hospital_stay: {
            title: '🏥 住院治疗',
            description: (health, target, daysLeft, cost) => `你正在住院治疗中...\n当前健康: ${health} / 目标: ${target} (预计约 ${daysLeft} 天)\n每日病房费: $${cost}`,
            descRestDay: '\n📅 今天是休息日，安心养病。',
            descPtoAvailable: (days) => `\n💼 你有 ${days} 天带薪病假可用。`,
            descPtoWarning: '\n⚠️ 警告：病假已耗尽！继续住院将扣除工资并增加解雇风险。',
            choices: {
                paidLeave: { text: '🛌 遵医嘱治疗 (带薪假)', hint: '消耗1 PTO，工资照发，工作安全' },
                restDay: { text: '🛌 遵医嘱治疗 (休息日)', hint: '仅支付住院费，无需请假' },
                unpaidLeave: { text: '🛌 遵医嘱治疗 (无薪假)', hint: (percent) => `扣除${percent}%月薪，增加解雇风险` },
                selfPay: { text: '🛌 遵医嘱治疗 (自费)', hint: '消耗存款恢复' },
                ama: { text: '🏃 强行出院 (AMA)', hint: (health, mental) => `需健康>=${health}，精神-${mental}` },
            },
            messages: {
                paidLeave: '安心养病一天。虽然在医院，但至少工资照发。',
                restDay: '休息日在医院度过，虽然无聊，但恢复不错。',
                unpaidSickLeave: (dailyPay) => `🚫 无薪病假: 将扣除本月工资约 $${dailyPay}`,
                firedWithInsurance: '❌ 坏消息！你收到公司的解雇邮件。因长期缺勤被开除！\n⚠️ 雇主医保将在次日失效！',
                fired: '❌ 坏消息！你收到公司的解雇邮件。因长期缺勤被开除！',
                fireRisk: (percent) => `无薪修养中... 解雇风险 ${percent}%`,
                selfPay: '在医院继续接受治疗...',
                ama: '你签署了《违背医嘱出院书》强行离开。身体虽然还虚弱，但你自由了。\n⚠️ 注意：可能会复发！',
            },
        },

        // 工作日
        day_work: {
            title: '工作日',
            description: '又是努力搬砖的一天。你打算怎么度过？',
        },

        // 休息日
        day_rest: {
            title: '🎉 休息日',
            description: '今天是休息日！你打算怎么利用这难得的自由时光？',
            choices: {
                sleep: { text: '🛌 深度补觉', hint: (e, h) => `+${e}精力，+${h}健康` },
                cook: { text: '🍳 在家做饭', hint: (i, h, m) => `-${i}食材，+${h}健康，+${m}精神` },
                grocery: { text: '🛒 超市大采购', hint: (c, i) => `-$${c}，+${i}食材（休息日折扣）` },
                gig: { text: '🛵 送外卖兼职', hint: (m, e) => `+$${m}，-${e}精力` },
                walk: { text: '🌳 城市漫游', hint: (c, m, chance, luckyMoney) => `-$${c}，+${m}精神（${chance}%概率捡到$${luckyMoney}）` },
                hangout: { text: '🎉 约朋友聚会', hint: (c, e, s, m) => `-$${c}，-${e}精力，+${s}社交，+${m}精神` },
                deep_sleep: { text: '🛌 深度补觉', hint: (m) => `精力回满，健康上限+1，社交-${m}` },
                massage: { text: '💆 中医推拿', hint: (c, h, maxH, e) => `-$${c}，健康+${h}，健康上限+${maxH}，精力-${e}` },
            },
            messages: {
                sleep: '睡到自然醒，元气满满！错过午顿也值得',
                cook: '亲手做了一顿丰盛的饭菜，既健康又放松！',
                grocery: '趁休息日采购一周的食材',
                gig: (money) => `放弃休息去送外卖，赚了$${money}`,
                walkLucky: (money) => `逛街时捡到$${money}！今天运气真好`,
                walk: '在城市中漫无目的地闲逛，放松身心',
                hangout: '虽然花了点钱，但和朋友们吐槽一番后，感觉活过来了！',
                deep_sleep: '睡得昏天黑地，醒来时虽然错过了几个电话，但感觉身体轻盈了不少。(健康上限+1)',
                massage: '老师傅的手法极其凶残，但按完之后你的颈椎终于感觉是自己的了。(健康上限+3)',
            },
        },

        // 求职日常
        day_jobless: {
            title: '求职日常',
            description: '没有工作的早晨，你打开招聘网站，看着满屏的"已读不回"...',
            choices: {
                apply: { text: '海投简历', hint: (e, rate, mental) => `-${e} 精力，${rate}%获得面试（受工作能力影响），失败精神-${mental}` },
                relax: { text: '刷视频放松', hint: (m) => `+${m} 精神` },
                learn: { text: '学习新技能', hint: (e, mental, workGain) => `-${e} 精力，-${mental}精神，工作能力+${workGain}` },
                medicaid: { text: '申请白卡福利', hint: (limit, energy) => `需总资产<${limit}且失业，-${energy}精力` },
            },
            messages: {
                applySuccess: '有公司回复了！约了下午面试',
                applyFail: '又是石沉大海的一天',
                relax: '刷了一上午视频，心情好了点',
                learn: '学了一些新东西，工作能力提升了',
                medicaidTooRich: (limit) => `系统提示：你的资产超过贫困限制 ($${limit})，无法申请。请先花光积蓄。`,
                medicaidApplied: (minDays, maxDays) => `提交了繁琐的申请表格。系统提示审批需要 ${minDays}-${maxDays} 个工作日。`,
            },
        },

        // 咖啡
        morning_coffee: {
            title: '来杯咖啡？',
            description: '路过咖啡店，咖啡的香气扑鼻而来...',
            choices: {
                buy: { text: '买杯咖啡', hint: (cost, energy, health) => `-$${cost}，+${energy} 精力，健康-${health}` },
                skip: { text: '忍住，省钱', hint: '保持现状' },
            },
            messages: {
                buy: '咖啡因让你精神振奋！',
                skip: (cost) => `你抵住了诱惑，省下了$${cost}`,
            },
        },

        // 面试
        afternoon_interview: {
            title: '面试机会',
            description: '终于等来了面试！你深吸一口气，准备展现最好的自己。',
            choices: {
                tryHard: {
                    text: '全力以赴',
                    hint: (energy, chance, mentalSuccess, mentalFail) => `-${energy} 精力，成功率${chance}%（受工作能力影响），成功精神+${mentalSuccess}，失败精神-${mentalFail}`,
                    hint_homeless: (energy) => `-${energy} 精力（流浪状态：面试官直接婉拒）`
                },
                casual: { text: '佛系面试', hint: (energy, chance, mental) => `-${energy} 精力，成功率${chance}%（低于全力以赴），成功精神+${mental}` },
            },
            messages: {
                homelessReject: '面试官看了看你的状态，婉拒了你',
                success: '🎉 恭喜！你拿到了offer！\n(福利：初始3天PTO)',
                fail: '面试失败了，继续努力吧',
                casualSuccess: '居然过了！运气不错',
                casualFail: '意料之中的失败',
            },
        },

        // 运动
        afternoon_exercise: {
            title: '运动时间',
            description: '下午有点空闲，要不要去运动一下？',
            choices: {
                gym: { text: '去健身房', hint: (energy, mental, health) => `-${energy} 精力，+${mental} 精神，+${health} 健康` },
                walk: { text: '散个步就好', hint: (energy, mental) => `-${energy} 精力，+${mental} 精神` },
                skip: { text: '还是躺着吧', hint: '保存精力' },
            },
            messages: {
                gym: '出了一身汗，感觉很棒！',
                walk: '在公园走了一圈，心情舒畅',
                skip: '你决定保存精力',
            },
        },

        // 零工
        afternoon_gig: {
            title: '零工机会',
            description: '有人在群里发了个短期工作机会，要不要接？',
            choices: {
                accept: { text: '接下这份零工', hint: (gain, energy) => `+$${gain}，-${energy} 精力` },
                decline: { text: '不接了', hint: '保存精力' },
            },
            messages: {
                tooTired: (money) => `太累了，效率很低，只拿到$${money}`,
                success: (money) => `零工完成！赚到$${money}`,
                decline: '你决定放弃这次机会',
            },
        },

        // PIP 警告
        pip_warning: {
            title: '⚠️ PIP警告',
            description: 'HR发来邮件，标题是"绩效改进计划"。你有5天时间证明自己，期间的工作表现将决定你的命运。',
            choices: {
                accept: { text: '接受挑战', hint: (days, mental) => `进入${days}天观察期，精神-${mental}` },
                quit: { text: '直接跳槽', hint: (energy, chance, raisePct, mentalGain, mentalLoss, pipDelta) => `-${energy} 精力，${chance}% 成功找到新工作（成功加薪${raisePct}%，精神+${mentalGain}；失败精神-${mentalLoss}，PIP${pipDelta}，进入PIP）` },
            },
            messages: {
                start: 'PIP观察期开始，接下来5天要好好表现！',
                quitSuccess: (oldIncome, newIncome) => `成功找到新工作！\n薪资涨幅: $${oldIncome} -> $${newIncome}`,
                quitFail: '暂时没找到合适的，只能硬着头皮接受PIP',
            },
        },

        // PIP 结果
        pip_result: {
            title: '📋 PIP结果公布',
            description: '观察期结束，HR约你谈话...',
            choices: {
                enter: { text: '走进会议室', hint: (mentalGain, mentalLoss) => `听取最终结果（通过精神+${mentalGain}，失败精神-${mentalLoss}，失败被解雇）` },
            },
            messages: {
                passed: '你通过了PIP！公司决定留用你。',
                failed: '很遗憾，你被解雇了。',
            },
        },

        // 突然被裁
        sudden_layoff: {
            title: '💼 突然被裁',
            description: '公司宣布裁员，你的名字赫然在列。这一切来得太突然了...',
            choices: {
                accept: { text: '接受现实', hint: (money, mental) => `+$${money}赔偿，精神-${mental}，被裁` },
                fight: { text: '据理力争', hint: (energy, mentalSuccess, mentalFail, successMoney, failMoney) => `-${energy}精力，成功精神-${mentalSuccess}，失败精神-${mentalFail}（成功+$${successMoney}，失败+$${failMoney}，均被裁）` },
            },
            messages: {
                accept: (amount) => `被裁了...至少拿到了$${amount}的赔偿金`,
                fightSuccess: (amount) => `据理力争后，拿到了$${amount}的赔偿！`,
                fightFail: (amount) => `争取失败，只拿到$${amount}赔偿，心力交瘁`,
            },
        },

        intern_badge_decision: {
            title: '📛 实习生背锅',
            description: 'HR通知你即将被裁。你想起了实习生工牌，也许能转移这次责任。',
            choices: {
                use: { text: '让实习生背锅', hint: (social) => `社交-${social}，保住工作` },
                accept: { text: '接受裁员', hint: '你不想害人' },
            },
            messages: {
                use: '实习生替你背锅，你暂时保住了工作。',
                accept: '你选择承担后果，离开了公司。',
            },
        },

        sell_car_emergency: {
            title: '紧急变现：卖车求生',
            description: '财务赤字已经到了危险的边缘。二手车商给你发来了报价，虽然远低于你心里的价位，但这笔钱能让你暂时缓一口气。但没有了车，在这个车轮上的国家寸步难行。',
            choices: {
                sell: {
                    text: '卖掉汽车',
                    hint: (gain, mentalLoss) => `获得 $${gain}，无法再开车通勤。若当前居住在车里，将流落街头。精神 -${mentalLoss}。`
                },
                keep: {
                    text: '拒绝出售',
                    hint: (loss) => `保留汽车，但财务危机将继续加剧。精神 -${loss}。`
                }
            },
            messages: {
                sell: '看着空荡荡的车位，你拿到了一笔救命钱。但以后上班的路会变得更加艰难。',
                keep: '你选择留下了车。也许你是对的，没有车就真的失去了一切机会。'
            }
        },

        // 购买二手车
        buy_used_car: {
            title: '二手车机会',
            description: '你在路边看到一辆待售的二手车。虽然旧了点，但价格还算公道。如果你现在没有车，这可能是一个不错的代步工具。',
            choices: {
                deal: {
                    text: '买下它',
                    hint: (cost, mentalGain) => `-$${cost}，获得汽车，精神+${mentalGain}`
                },
                ignore: {
                    text: '算了',
                    hint: '不需要或买不起'
                }
            },
            messages: {
                deal: '你重新拥有了一辆车！虽然不是新车，但至少不用在公交车上挤了。',
                ignore: '你摇了摇头，离开了。现在的财务状况也许不适合这笔支出。'
            }
        },

        // 车辆故障
        car_breakdown: {
            title: '🚗 车辆故障',
            description: '上班路上，车子突然抛锚了。可能是变速箱问题，或者你不小心撞到了路牙石。',
            choices: {
                repairNow: {
                    text: '立即送修',
                    hintFull: (cost, mental) => `-$${cost} (全险免赔额)，精神-${mental}`,
                    hintPartial: (cost, mental) => `-$${cost} (半险赔付后自付)，精神-${mental}`,
                    hintOther: (cost, mental) => `-$${cost} (自费维修)，精神-${mental}`,
                },
                creditRepair: { text: '刷信用卡维修', hint: (cost, credit, mental) => `-$${cost}，信用-${credit}，精神-${mental}` },
                skip: { text: '暂不修理', hint: (mental) => `车辆故障，下次开车需自费修理，保险不保，精神-${mental}` },
            },
            messages: {
                fullCoverage: '幸好买了全险，保险公司承担了大部分维修费，你只付了免赔额。',
                partialCoverage: '半险帮你分担了一部分维修费，但你仍需要自付不少费用。',
                noFullCoverage: '因为没有足够保险保障，你不得不几乎全额支付昂贵的维修费。心在滴血...',
                creditRepair: '不得不透支信用卡修车，债务压力增加了',
                skipRepair: '你决定暂时不修车。在修好之前，开车通勤需要额外支付修理费并会迟到。',
            },
        },

        // 交通意外 (Car Accident during Commute)
        traffic_accident: {
            message: "🚗 发生交通事故！车辆受损，需要维修。维修费 -${0}, 健康 -{1}, 精神 -{2}"
        },

        // 入室盗窃
        burglary: {
            title: '🔓 入室盗窃',
            description: '你回到家，发现门锁被撬开了。家里被翻得乱七八糟...',
            choices: {
                report: {
                    text: '报警并报修',
                    hintInsured: (cost, mental) => `-$${cost} (免赔额)，精神-${mental}`,
                },
            },
            messages: {
                insured: (deductible) => `不幸中的万幸，租客保险赔付了大部分损失。你只支付了$${deductible}的免赔额。`,
            },
        },

        // 公寓火灾
        apartment_fire: {
            title: '🔥 公寓火灾',
            description: '半夜，火警铃声大作。楼下邻居忘了关火炉，火势迅速蔓延...',
            choices: {
                escape: {
                    text: '逃生并清算损失',
                    hintInsured: (cost, mental) => `-$${cost} (免赔额)，精神-${mental}`,
                },
            },
            messages: {
                insured: (deductible) => `一场大火烧毁了许多东西。好在有租客保险，你只损失了免赔额$${deductible}，还得重新找住处。`,
            },
        },

        // 身体不适
        feeling_under_weather: {
            title: '🤧 身体不适',
            description: '你感觉喉咙痛，头也昏昏沉沉的。可能是感冒了。',
            choices: {
                clinic: { text: '去分钟诊所 (Minute Clinic)', hint: (cost, success, fail, insurancePays, baseCost) => `-$${cost} (原价 $${baseCost}, 保险赔付 $${insurancePays})，健康+${success}或-${fail}` },
                otc: { text: '吃非处方药 (OTC)', hint: (cost, diff) => `-$${cost}，健康+${diff}或-${diff}` },
                urgentCare: { text: '去急救中心 (Urgent Care)', hint: (cost) => `-$${cost}` },
                ignore: { text: '硬扛', hint: (health, mental) => `健康-${health}，精神-${mental}` },
            },
            messages: {
                clinicFail: '诊所护士觉得你没事，但你感觉更糟了...',
                clinicSuccess: '拿了点抗生素，感觉好多了。',
                otcFail: '药吃了，但没什么用。',
                otcSuccess: '非处方药起效了，感觉好一点。',
                ignore: '你决定硬扛，希望明天会好起来。',
            },
        },

        // 夜间事件
        night_routine: {
            title: '🌙 夜间时光',
            description: '一天的工作结束了，现在是属于你的时间。',
            choices: {
                sleep: { text: '好好睡觉', hint: (mental) => `恢复精力，+${mental}精神` },
                phone: { text: '熬夜玩手机', hint: (mental, energyPenalty) => `+${mental}精神，明天精力-${energyPenalty}` },
                overtime: { text: '加班工作', hint: (money, energy, mental, progress) => `+$${money}，-${energy}精力，-${mental}精神，进度+${progress}%` },
                entertainment: { text: '🎉 出去放松', hint: (cost, mental, energyPenalty) => `-$${cost}，+${mental}精神，明天精力-${energyPenalty}` },
                prepareMeal: { text: '🍳 准备明天的便当', hint: (ingredients, energy) => `-1食材，-${energy}精力，明天有便当吃` },
                grocery: { text: '🛒 去超市采购食材', hint: (cost, ingredients, energy) => `-$${cost}，+${ingredients}食材，-${energy}精力` },
            },
            messages: {
                sleep: (recovery) => `你睡了个好觉，明天将恢复 ${recovery} 点精力`,
                phone: '刷手机到深夜，心情变好了，但明天会很累',
                overtime: (money, bonus) => `加班到深夜，赚了$${money}但身心俱疲${bonus}`,
                overtimeProgress: (progress, progressGain) => `，进度 +${progressGain}% (当前 ${progress}%)`,
                overtimeComplete: ' ✅ 任务完成！',
                entertainment: (cost) => `和朋友聚会到深夜，花了$${cost}但心情大好`,
                prepareMeal: '花了一些时间准备明天的便当，省钱又健康！',
                grocery: '去超市买了一周的食材，冰箱满满的',
            },
        },

        // 2. 症状加重
        worsening_symptoms: {
            title: '🤒 症状加重',
            description: '之前的病没好利索，现在发起了高烧，咳嗽不止。你必须做点什么了。',
            choices: {
                urgentCare: { text: '急救中心 (Urgent Care)', hint: (cost, health, insurancePays, baseCost) => `预计 -$${cost} (原价 $${baseCost}, 保险赔付 $${insurancePays})，健康+${health}` },
                pcp: { text: '预约家庭医生 (PCP)', hint: (wait) => `预计等待${wait}天` },
                er: { text: '去急诊室 (ER)', hint: (healthDelta, cost, insurancePays, baseCost) => `健康${healthDelta}，预计 -$${cost} (原价 $${baseCost}, 保险赔付 $${insurancePays})，最快但也最贵` }
            },
            messages: {
                urgentCareTreated: (cost) => `治疗费 $${cost}。`,
                urgentCareOutOfNetwork: ' ⚠️ 居然是网外诊所，保险几乎没报销！',
                urgentCareResult: ' 烧退了。',
                pcpBooked: (days) => `预约成功。最早的号在 ${days} 天后。这几天只能熬着了...`,
                erTreated: (cost) => `在急诊室折腾了一晚，花费 $${cost}。`,
                erDenied: ' ⚠️ 保险拒赔！'
            }
        },

        // 3. 医疗紧急情况
        medical_emergency: {
            title: '🚑 医疗紧急情况',
            description: '你倒在了地上，呼吸困难。如果不马上去急诊室，可能会死。',
            choices: {
                ambulance: { text: '叫救护车去ER', hint: (healthDelta, mental, cost, insurancePays, baseCost) => `健康${healthDelta}，精神-${mental}，预计 -$${cost} (原价 $${baseCost}, 保险赔付 $${insurancePays})` },
                uber: { text: '叫 Uber 去ER', hint: (cost, deathChance, healthDelta, insurancePays, baseCost) => `预计 -$${cost} (原价 $${baseCost}, 保险赔付 $${insurancePays})，${deathChance}%途中死亡，健康${healthDelta}` },
                giveUp: { text: '放弃', hint: (healthLoss) => `健康-${healthLoss}，游戏结束` }
            },
            messages: {
                ambulanceSaved: (bill, days) => `捡回一条命，但情况严重需住院治疗。\nER账单: $${bill} (已付)\n预计住院: ${days}天`,
                uberDied: '不管用了...你在Uber后座失去了意识...',
                uberSaved: (bill, days) => `勉强没死在车上。ER账单 $${bill}。\n医生要求立即住院治疗 (${days}天)。`,
                died: '你闭上了眼睛...',
                surgeryCancelled: '\n⚠️ 由于进行了紧急手术，之前的择期手术审批已取消。'
            }
        },

        // 房租到期
        rent_due: {
            title: '房租到期',
            description: (cost) => `房东发来消息：房租 $${cost} 到期了。`,
            choices: {
                pay: { text: '支付房租', hint: (cost) => `-$${cost}` },
                negotiate: {
                    text: '协商延期',
                    hint: (chance, creditSuccess, mentalSuccess, creditFail, mentalFail) => `${chance}% 成功：信用-${creditSuccess}，精神-${mentalSuccess}；失败：被驱逐，信用-${creditFail}，精神-${mentalFail}`
                },
                moveOut: { text: '搬到廉价房', hint: (cost, mental) => `月租${cost}，精神-${mental}` },
                carDwelling: { text: '立刻搬离：住进车里', hint: (mental) => `房租归零，精神-${mental}，信用不变` },
                homelessNow: { text: '立刻搬离：流落街头', hint: (mental, credit) => `房租归零，精神-${mental}，信用-${credit}` }
            },
            messages: {
                paid: (cost) => `房租 $${cost} 已支付`,
                negotiateSuccess: '房东同意延期几天',
                negotiateFail: '房东拒绝了，你被赶出了公寓',
                moveOut: '你搬到了一个廉价合租房',
                carDwelling: '你连夜收拾行李住进了车里。至少不用面对房东的冷眼。',
                homelessNow: '你主动退租离开，现在流落街头。'
            }
        },

        // 朋友帮助
        friend_help: {
            title: '朋友伸援手',
            description: '老朋友得知你的情况后，主动联系你想帮忙。',
            choices: {
                accept: { text: '接受帮助', hint: (money, mental, shelterMental) => `+$${money || 1000}，精神 + ${mental}，或临时住处(精神提升)` },
                decline: { text: '感谢但婉拒', hint: (mental, social) => `保持自尊，+${mental} 精神，+${social} 社交` }
            },
            messages: {
                shelter: '朋友收留了你，终于有地方住了',
                money: (amount) => `朋友借给你$${amount || 1000} `,
                decline: (mental) => `你选择独自面对困难，但保持了自尊，精神 + ${mental} `
            }
        },

        // 无家可归
        homeless_night: {
            title: '无处可去',
            description: '又一个没有屋檐的夜晚。你需要找个地方睡觉。',
            choices: {
                street: { text: '找个角落睡', hint: (mental, health, recovery) => `- ${mental} 精神，-${health} 健康，明天精力${recovery} ` },
                shelter: { text: '去庇护所碰运气', hint: (chance, successMental, failMental, failHealth, successRecovery, failRecovery) => `${chance}% 有床位，成功精神 - ${successMental}，明天精力${successRecovery}；失败精神 - ${failMental}，健康 - ${failHealth}，明天精力${failRecovery} ` }
            },
            messages: {
                street: '在街头度过了艰难的一夜',
                shelterSuccess: '庇护所有空位，至少能睡个好觉',
                shelterFail: '庇护所满了，只能睡街头'
            }
        },

        // 车中过夜
        car_night: {
            title: '车中一夜',
            description: '你在车里放倒座椅，准备入睡。希望不会被警察敲窗...',
            choices: {
                hide: { text: '找个隐蔽的地方停车', hint: (mental, recovery) => `- ${mental} 精神，明天精力${recovery} ` },
                parkClose: { text: '就近停车', hint: (kickMental, safeMental, kickRecovery, safeRecovery) => `可能被驱赶，平安精神 - ${safeMental}，明天精力${safeRecovery}；被驱赶精神 - ${kickMental}，明天精力${kickRecovery} ` }
            },
            messages: {
                safe: '找了个沃尔玛停车场，相对安全',
                kickedOut: '半夜被警察敲窗驱赶，心累',
                safeNight: '平安度过一夜'
            }
        },

        // 酷热天气
        hot_weather: {
            title: '🥵 酷热天气',
            description: '今晚气温高达32度，公寓里闷热难耐，让人难以入眠。',
            choices: {
                ac: { text: '❄️ 开空调降温', hint: (mental, bill, recovery) => `凉爽入睡，+${mental} 精神，水电费 + ${bill}，明天精力${recovery} ` },
                fan: { text: '💨 开风扇硬撑', hint: (mental, bill, recovery) => `- ${mental} 精神，水电费 + ${bill}，明天精力${recovery} ` },
                none: { text: '🥵 什么都不开', hint: (mental, health, recovery) => `- ${mental} 精神，-${health} 健康，明天精力${recovery} ` }
            },
            messages: {
                ac: (bill) => `空调带来清凉，舒适入睡，但下个月水电费会涨$${bill} `,
                fan: '风扇吹的热风让你翻来覆去，睡眠质量很差',
                none: '热得辗转难眠，第二天头昏脑涨'
            }
        },

        // 失眠
        insomnia: {
            title: '😵‍💫 失眠夜',
            description: '躺在床上翻来覆去，脑子里全是明天的工作和账单，怎么也睡不着...',
            choices: {
                pills: { text: '💊 吃安眠药', hint: (cost, health, recovery) => `- $${cost}，保证入睡，-${health} 健康，明天精力${recovery} ` },
                phone: { text: '📱 刷手机转移注意力', hint: (mental, recovery) => `+ ${mental} 精神，明天精力${recovery} ` },
                meditate: { text: '🧘 尝试冥想放松', hint: (chance, mental, successRecovery, failRecovery) => `${chance}% 成功入睡，+${mental} 精神，成功明天精力${successRecovery}，失败明天精力${failRecovery} ` }
            },
            messages: {
                pills: '药效让你昏昏沉沉地睡着了，但对身体不太好',
                phone: '刷到凌晨三点才迷迷糊糊睡着',
                meditateSuccess: '冥想帮助你平静下来，慢慢进入梦乡',
                meditateFail: '虽然放松了一些，但还是辗转到很晚'
            }
        },

        // 神秘商人
        mysterious_trader: {
            title: '神秘商人',
            description: '一个穿着风衣的阴影走近了你。"嘿，小子。想用你手里的那个遗物换点...更有趣的东西吗？"',
            choices: {
                swap: {
                    text: '交换神器',
                    hint: '获得一个新的随机神器，失去当前的神器',
                    message: (name) => `交易成功！你获得了：${name}。`,
                    error: '他没货了...'
                },
                refuse: {
                    text: '拒绝',
                    hint: '保持当前的配置',
                    message: '你转身走开了。'
                }
            }
        },

        // 卖神器 - 危机
        sell_artifact_crisis: {
            title: '变卖传家宝',
            description: '负债累累，债主已经堵到了门口。你手里摩挲着那件所谓的神器，也许它是你翻身的资本，但现在，它或许只能换来几天的安宁。',
            choices: {
                sell: {
                    text: '忍痛割爱',
                    hint: (gain, mentalLoss) => `出售神器，获得$${gain}，精神 - ${mentalLoss} `
                },
                keep: {
                    text: '绝不放弃',
                    hint: (mentalGain) => `保留神器，精神 + ${mentalGain}，但债务危机依旧`
                }
            },
            messages: {
                sell: (gain) => `你把神器卖给了当铺，换来了$${gain}。心里空荡荡的。`,
                keep: '你决定无论如何也要留住它。这是你最后的希望。'
            }
        },

        // 买神器 - 黑市
        black_market_artifact: {
            title: '黑市交易',
            description: '你在暗网的一个隐秘角落发现了一个卖家。他声称手里有些"特殊"的货色。既然你现在手里有点闲钱，要不要赌一把？',
            choices: {
                buy: {
                    text: '购买盲盒',
                    hint: (cost) => `支付$${cost}，随机获得一个神器`
                },
                leave: {
                    text: '离开',
                    hint: '不感兴趣'
                }
            },
            messages: {
                buy: (name) => `交易成功！你获得了：${name}。`,
                leave: '你关闭了网页，钱还是留着应急吧。'
            }
        },

        // 社交事件
        team_lunch: {
            title: '团队聚餐',
            description: '同事们提议今天中午一起去附近的新餐厅聚餐。这是个拉近关系的好机会。',
            choices: {
                join: { text: '参加聚餐', hint: (cost, social, eff) => `- $${cost}，社交 + ${social}，工作能力 + ${eff} ` },
                brown_bag: { text: '自己带饭', hint: (ing, energy, social) => `消耗${ing} 食材，精力 + ${energy}，社交 - ${social} ` }
            },
            messages: {
                join: '大家聊得很开心，你也听到了不少公司八卦。',
                brown_bag: '你一个人在工位上吃饭，虽然省钱，但显得有些不合群。'
            }
        },
        after_work_drinks: {
            title: '下班小酌',
            description: '下班后，几个核心团队成员和老板准备去酒吧喝一杯。',
            choices: {
                network: { text: '扩展人脉', hint: (cost, energy) => `- $${cost}，精力 - ${energy}。成功率受社交和工作能力影响。` },
                go_home: { text: '早点回家', hint: (energy, social) => `精力 + ${energy}，社交 - ${social} ` }
            },
            messages: {
                success: (eff, mental, social) => `你在酒局上表现得体，老板对你的见解印象深刻！(工作能力 + ${eff}, 精神 + ${mental}, 社交 + ${social})`,
                fail: (mental, social) => `你喝多了说了些不该说的话，气氛一度很尴尬。(精神 - ${mental}, 社交 - ${social})`,
                go_home: '你婉拒了邀请。虽然休息不错，但你感到自己正在边缘化。'
            }
        },
        industry_mixer: {
            title: '行业交流会',
            description: '你注意到本市有一个行业专业人士的交流酒会。很多公司的大佬都会去。',
            choices: {
                network: { text: '展示专业能力', hint: (cost, energy) => `- $${cost}，精力 - ${energy}。成功率受工作能力影响。` },
                skip: { text: '算了', hint: '省钱要紧' }
            },
            messages: {
                success: (social, mental) => `你成功与几位业内资深人士建立了联系，收获颇丰。(社交 + ${social}, 精神 + ${mental})`,
                fail: (mental) => `你在角落里站了一晚，没人对你的经历感兴趣。(精神 - ${mental})`,
                skip: '你决定不去凑热闹了。'
            }
        },
        alumni_reunion: {
            title: '校友重聚',
            description: '大学校友会发来邀请函，举办年度重聚晚宴。',
            choices: {
                attend: { text: '盛装出席', hint: (cost) => `- $${cost}。成功率受社交值影响。` },
                ignore: { text: '假装没看见', hint: (mental) => `精神${mental} ` }
            },
            messages: {
                success: (mental, social) => `你是全场的焦点！大家都很羡慕你的现状。(精神 + ${mental}, 社交 + ${social})`,
                fail: (mental, social) => `别人都在谈论千万年薪和上市公司，你感到格格不入。(精神 - ${mental}, 社交 - ${social})`,
                ignore: '你把邀请函扔进了垃圾桶。眼不见心不烦。'
            }
        },


        // 邻居噪音
        neighbor_noise: {
            title: '🔊 邻居噪音',
            description: '隔壁传来震耳欲聋的音乐声和欢笑声，看来有人在开派对...',
            choices: {
                complain: { text: '🚪 去敲门投诉', hint: (successChance, conflictLoss, successRecovery, failRecovery) => `${successChance}% 安静，失败精神 - ${conflictLoss}，成功明天精力${successRecovery}，失败明天精力${failRecovery} ` },
                earplugs: { text: '🎧 戴耳塞硬撑', hint: (recovery) => `明天精力${recovery} ` },
                police: { text: '📞 报警处理', hint: (successChance, social, recovery) => `${successChance}% 安静，-${social} 社交，明天精力${recovery} ` }
            },
            messages: {
                complainSuccess: '邻居道歉并关小了音乐，终于能睡觉了',
                complainFail: '邻居态度恶劣，差点吵起来，心情糟糕透了',
                earplugs: '耳塞隔音效果有限，断断续续睡了一夜',
                police: '警察来了之后终于安静了，但你可能得罪了邻居'
            }
        },

        // 加班消息
        boss_late_message: {
            title: '📱 深夜工作消息',
            description: '手机震了一下，是老板发来的消息：「明天早上8点开会」',
            choices: {
                reply: { text: '✅ 秒回确认', hint: (social, mental, recovery) => `+ ${social} 社交，-${mental} 精神，明天精力${recovery} ` },
                ignore: { text: '😴 假装没看到', hint: '正常睡觉，明天精力不变' },
                prepare: { text: '📝 熬夜准备材料', hint: (social, recovery) => `+ ${social} 社交，明天精力${recovery} ` }
            },
            messages: {
                reply: '回复后开始焦虑明天的会议内容，久久不能入睡',
                ignore: '工作的事明天再说，今晚好好休息',
                prepare: '连夜准备了会议材料，但明天肯定精神不济'
            }
        },

        // 深夜馋嘴
        late_night_craving: {
            title: '🍜 深夜馋嘴',
            description: '肚子突然咕咕叫，好想吃点夜宵...',
            choices: {
                order: { text: '🍔 点个外卖', hint: (cost, mental, health, recovery) => `- $${cost}，+${mental} 精神，-${health} 健康，明天精力${recovery} ` },
                cook: {
                    text: '🍳 自己做点简餐',
                    hint: (ingredients, health, recovery) => `- ${ingredients} 食材，+${health} 健康，${recovery === 0 ? '明天精力不变' : `明天精力${recovery}`} `
                },
                water: {
                    text: '💧 喝杯水忍着',
                    hint: (mental, recovery) => `- ${mental} 精神，${recovery === 0 ? '明天精力不变' : `明天精力${recovery}`} `
                }
            },
            messages: {
                order: '吃饱喝足，心满意足地睡去',
                cook: '给自己煮了碗面，健康又节省',
                water: '强忍着饥饿睡去，梦里全是美食'
            }
        },

        // 噩梦
        nightmare: {
            title: '😱 噩梦惊醒',
            description: '从噩梦中惊醒，满头大汗，心跳如雷。梦里你被裁员、流落街头...',
            choices: {
                breathe: { text: '🌙 深呼吸冷静', hint: (mental, successRecovery, failRecovery) => `失败精神 - ${mental}，成功明天精力${successRecovery}，失败明天精力${failRecovery} ` },
                getUp: { text: '💡 起来做点事', hint: (mental, recovery) => `+ ${mental} 精神，明天精力${recovery} ` }
            },
            messages: {
                sleepBad: '勉强平复心情，但之后睡得很浅',
                sleepTerrible: '噩梦的阴影挥之不去，彻夜难眠',
                distract: '干脆起来整理房间，转移注意力后才再次入睡'
            }
        },

        // 孤独
        loneliness: {
            title: '😔 孤独感袭来',
            description: '你突然意识到已经很久没有和朋友联系了。手机通讯录里的名字越来越陌生...',
            choices: {
                contact: { text: '📱 主动联系老朋友', hint: (cost, social, mental, recovery) => `- $${cost} (请客)，+${social} 社交，+${mental} 精神，明天精力${recovery > 0 ? `+${recovery}` : recovery} ` },
                socialMedia: { text: '💬 刷社交媒体', hint: (social, mental, recovery) => `+ ${social} 社交，-${mental} 精神，明天精力${recovery > 0 ? `+${recovery}` : recovery} ` },
                bear: { text: '😢 独自承受', hint: (mental) => `- ${mental} 精神` }
            },
            messages: {
                contact: '和老朋友聊了很久，感觉没那么孤单了',
                socialMedia: '刷了一晚上朋友圈，看着别人的生活更emo了',
                bear: '一个人默默承受这份孤独，眼眶有些湿润'
            }
        },

        // 紧急就医
        emergency_oon: {
            title: '🚨 紧急送医',
            description: '你突然胸口剧痛倒下。急救人员问：送哪家医院？',
            choices: {
                nearest: { text: '🏥 最近的医院！', hint: (chance, health, mental, oonCost, inCost, insurancePays, baseCost) => `${chance}% 网外(自付 - $${oonCost}, 精神 - ${mental})，健康 + ${health}，网内自付 - $${inCost} (原价 $${baseCost}, 保险赔付 $${insurancePays})` },
                inNetwork: { text: '📍 先找网内医院', hint: (health, mental, cost, insurancePays, baseCost) => `健康 - ${health}，精神 - ${mental}，自付 - $${cost} (原价 $${baseCost}, 保险赔付 $${insurancePays})` }
            },
            messages: {
                oon: (cost) => `命是救回来了！但是网外医院，自付 $${cost} `,
                network: (cost) => `运气好是网内医院，自付 $${cost} `,
                delay: (cost) => `找医院耽误了时间，病情恶化。自付 $${cost} `
            }
        },

        // 手术
        surgery_required: {
            title: '🏥 需要手术',
            description: '医生说你需要做个小手术，不是急诊但很紧急。',
            choices: {
                urgent: { text: '💉 立即手术', hint: (cost, health, mental, insurancePays, baseCost) => `- $${cost} (原价 $${baseCost}, 保险赔付 $${insurancePays})，健康 + ${health}，精神 - ${mental} ` },
                wait: { text: '📝 等待审批 (常规流程)', hint: (health, mental, minDays, maxDays) => `健康 - ${health}，精神 - ${mental}，需等待${minDays} -${maxDays} 天` },
                fight: { text: '⚔️ 紧急申诉 (要求立即手术)', hint: (mental, health, chance, successCost, failCost, successInsurancePays, successBaseCost) => `- ${mental} 精神，健康 - ${health}，${chance}% 成功(成功自付$${successCost}[原价 $${successBaseCost}, 保险赔付 $${successInsurancePays}]，失败自付$${failCost})` }
            },
            messages: {
                denied: (cost) => `未获事前审批(Prior Authorization)，保险拒赔。自付 $${cost} `,
                wait: (days) => `进入审批等待期（预计${days} 天），期间健康持续下降`,
                fightSuccess: (cost) => `申诉成功！获得了紧急手术批准(Emergency Approval)。按医保报销后自付 $${cost} `,
                fightFail: (cost) => `申诉失败，保险公司坚持拒赔。自付 $${cost} `
            }
        },

        surgery_approval: {
            title: '🏥 手术审批结果',
            description: '医院通知你，手术审批结果出来了。',
            choices: {
                check: { text: '📨 查看结果', hint: (chance, successCost, successHealth, failHealth, failMental, successInsurancePays, successBaseCost) => `审批通过率 ${chance}%（通过自付$${successCost} [原价 $${successBaseCost}, 保险赔付 $${successInsurancePays}]，健康 + ${successHealth}；失败健康 + ${failHealth}，精神 - ${failMental}）` }
            },
            messages: {
                approved: (cost, health) => `审批通过，安排手术。自付 $${cost}，健康 + ${health} `,
                denied: (cost, health, mental) => `审批失败，只能自费手术。自付 $${cost}，健康 + ${health}，精神 - ${mental} `
            }
        },

        // 送货事故
        gig_accident: {
            title: '🚗 送货事故',
            description: '送外卖途中出了车祸。理赔员问：你当时在干什么？',
            choices: {
                truth: { text: '😇 实话实说：在送货', hint: (cost, mental) => `拒赔，自付 - $${cost}，精神 - ${mental} ` },
                lie: { text: '🤥 撒谎：就是正常开车', hint: (chance, cost, success) => `${chance}% 逃避责任（成功 + $${success}，失败 - $${cost}）` },
                fraud: { text: '😤 实话实说：在送货', hint: (cost) => `拒赔，自付 - $${cost} ` }
            },
            messages: {
                denied: (cost) => `保险拒赔：商业用途不在保障范围。自付 $${cost} `,
                fraud: (fine) => `被查出保险欺诈！罚款 $${fine}，信用分暴跌`,
                covered: (cost) => `蒙混过关，自付 $${cost} `,
                lieSuccess: '保险公司信了你的话，赔付了全部损失！',
                lieFail: (cost) => `被查出保险欺诈！罚款 $${cost}，信用分暴跌`
            }
        },

        // 水电费
        utility_bill_due: {
            title: '水电费账单',
            description: (cost) => `本月水电费账单寄来了：$${cost} `,
            choices: {
                pay: { text: '立即支付', hint: (cost) => `- $${cost} ` },
                delay: { text: '拖延支付', hint: (score) => `信用分数 - ${score} ` }
            },
            messages: {
                paid: (cost) => `支付了$${cost} 水电费`,
                delayed: '延期一周，但影响了信用分数'
            }
        },

        // 话费
        phone_bill_due: {
            title: '手机费账单',
            description: (cost) => `运营商发来短信：本月话费$${cost} 到期`,
            choices: {
                pay: { text: '支付话费', hint: (cost) => `- $${cost} ` },
                delay: { text: '暂时不交', hint: '必定停机' }
            },
            messages: {
                paid: '话费已支付',
                delayed: '运营商立即停机，无法拨打电话'
            }
        },

        // 车险
        car_insurance_due: {
            title: '汽车保险账单',
            description: (cost) => `保险公司账单：月保险费 $${cost} `,
            choices: {
                pay: { text: '支付保险', hint: (cost) => `- $${cost} ` },
                cancel: { text: '取消保险', hint: '省钱但违法驾驶' }
            },
            messages: {
                paid: (cost) => `汽车保险 $${cost} 已支付`,
                cancelled: (cost) => `取消保险省了 $${cost}，但现在开车违法了`
            }
        },

        // 救济金申请
        unemployment_benefit: {
            title: '📋 失业救济金',
            description: (days) => `你已经失业 ${days} 天了。可以申请失业救济金来渡过难关。`,
            choices: {
                apply: { text: '📝 申请救济金', hint: (pay, weeks) => `每周领取 $${pay}，持续${weeks} 周` },
                decline: { text: '❌ 不申请', hint: '保留尊严' }
            },
            messages: {
                approved: (amount) => `申请通过！每周可领取 $${amount} 的失业救济金`,
                declined: '你决定不依赖救济金，但压力更大了'
            }
        },

        // 救济金发放
        unemployment_payment: {
            title: '💰 救济金到账',
            description: '本周的失业救济金已发放。',
            choices: {
                collect: { text: (amount) => `✅ 领取 $${amount} `, hint: (weeks) => `剩余 ${weeks} 周` }
            },
            messages: {
                lastPayment: (amount) => `领取了 $${amount}，这是最后一周的救济金了`,
                payment: (amount, weeks) => `领取了 $${amount}，还剩 ${weeks} 周`
            }
        },



        // 寒流来袭
        cold_weather: {
            title: '❄️ 寒潮来袭',
            description: (temp) => `今晚气温骤降至 ${temp}°C！如果不采取措施，可能会生病。`,
            choices: {
                heatHigh: { text: '🔥 暖气开到最高', hint: (money, energy) => `- $${money}，-${energy} 精力` },
                wearMore: { text: '🧥 多穿衣服硬抗', hint: (money, energy) => (money ? `- $${money}，-${energy} 精力` : ` - ${energy} 精力`) },
                gym: { text: '🏃 去健身房过夜', hint: (money, energy, health) => `- $${money}，-${energy} 精力，+${health} 健康` }
            },
            messages: {
                heatHigh: '屋里暖和得像夏天，虽然费电，但睡得很香',
                wearMore: '裹着厚厚的被子还是有点冷，没睡好',
                gym: '在健身房锻炼取暖，还顺便蹭了个澡'
            }
        },

        // 快餐警告
        fastfood_warning: {
            title: '🍔 垃圾食品警告',
            description: (days) => `你已经连续 ${days} 天吃快餐了，身体开始抗议...`,
            choices: {
                healthy: { text: '🥗 决定改善饮食', hint: (cost, health, ingredients) => `- $${cost} 买健康食材，健康 + ${health}，食材 + ${ingredients} ` },
                ignore: { text: '😞 继续凑合', hint: (health, mental) => `- ${health} 健康，-${mental} 精神` }
            },
            messages: {
                healthy: '买了些健康食材，决定好好照顾自己',
                ignore: '身体越来越差，但也没办法...'
            }
        },

        // 公寓意外
        apartment_accident: {
            title: '🔥 公寓意外',
            description: '你的公寓发生了意外！邻居的电线短路引发小火灾，你的一些物品被损坏了。',
            choices: {
                repair: {
                    text: '🛠️ 处理事故',
                    hintInsured: (deductible, mental) => `有租客保险：支付免赔额 $${deductible}，精神 - ${mental} `,
                    hintUninsured: (loss, mental) => `无保险：全额承担损失 $${loss}，精神 - ${mental} `
                }
            },
            messages: {
                insured: (amount) => `幸好有租客保险，只支付了免赔额 $${amount}。`,
                uninsured: (loss) => `因为没有租客保险，你不得不承担全部损失 $${loss}。`
            }
        },

        // 信用崩塌
        credit_collapse: {
            title: '💳 信用崩塌',
            description: '你的信用分数跌破 500 分！银行冻结了你的信用卡，房东也开始怀疑你的支付能力...',
            choices: {
                accept: { text: '😰 接受现实', hint: '信用卡被冻结，部分选项不可用' },
                fix: { text: '💪 尝试修复信用', hint: (cost, score, energy, mental) => `- $${cost} 咨询费，信用 + ${score}，-${energy} 精力，-${mental} 精神` }
            },
            messages: {
                evicted: '信用崩塌！房东以信用问题为由将你驱逐，你只能住在车里',
                frozen: '信用崩塌！银行冻结了你的信用卡，很多事情变得更难了',
                fixed: (cost) => `花了 $${cost} 咨询信用修复专家，情况稍有好转`
            }
        },

        // 医疗债务催收
        medical_debt_collection: {
            title: '📞 债务催收电话',
            description: (debt) => `医疗债务催收公司打来电话，要求你支付 $${debt} 的欠款。`,
            choices: {
                pay: { text: '💰 全额支付', hint: (debt, credit, mental) => `- $${debt}，信用 + ${credit}，精神 + ${mental} ` },
                installment: { text: '🤝 协商分期', hint: (amount, score, mental) => `每月还款${amount}，信用分 - ${score}，精神 - ${mental} ` },
                refuse: { text: '🙈 拒接电话', hint: (score, mental) => `信用分 - ${score}，精神 - ${mental} ` }
            },
            messages: {
                paid: (debt) => `还清了 $${debt} 的医疗债务，信用分稍有恢复`,
                installment: (amount) => `达成分期协议，每月需要还 $${amount} `,
                refused: '逃避并不能解决问题，信用分大幅下降'
            }
        },

        // 医疗债务分期
        medical_debt_installment: {
            title: '💳 医疗债务分期',
            description: '本月的医疗债务分期款到期了。',
            choices: {
                pay: { text: (amount) => `💰 支付 $${amount} `, hint: (amount, debt) => ` - $${amount}，剩余债务 ${debt} ` },
                cantPay: { text: '😰 无力支付', hint: (score, mental) => `信用分 - ${score}，精神 - ${mental}，债务 + 利息` }
            },
            messages: {
                paidFinished: '恭喜！医疗债务已全部还清',
                paid: (amount, debt) => `支付了 $${amount}，剩余债务 $${debt} `,
                cantPay: (debt) => `无法支付本期款项，债务增加到 $${debt} `
            }
        },

        // 每日随机行动
        daily_actions: {
            buy_coffee: { text: '☕ 买杯咖啡', hint: (cost, energy) => `- $${cost}，+${energy} 精力`, message: '喝了杯咖啡，感觉清醒多了' },
            take_walk: { text: '🚶 下楼散步', hint: (energy, mental, health) => `- ${energy} 精力，+${mental} 精神，+${health} 健康`, message: '趁休息时间散了个步，呼吸新鲜空气' },
            gossip: { text: '💬 办公室八卦', hint: (energy, social) => `- ${energy} 精力，+${social} 社交`, message: '听到了不少公司秘闻' },
            short_nap: { text: '😴 极速午睡', hint: (energy) => `+ ${energy} 精力`, message: '趴在桌子上眯了会儿，回血了' },
            teamwork: { text: '🤝 与同事协作', hint: (energy, social, work) => `- ${energy} 精力，+${social} 社交，工作能力 + ${work} `, message: '与同事配合完成了一项任务，感觉不错' },
            none: { text: '💨 专注当下', hint: '不选额外行动' }
        },

        // 工作突发事件
        work_incidents: {
            urgent_meeting: {
                title: '📅 紧急追加会议',
                choices: {
                    attend: { text: '✅ 参加并表现', hint: (energy, social, workGain) => `- ${energy} 精力，+${social} 社交，工作能力 + ${workGain} ` },
                    ignore: { text: '❌ 保持沉默', hint: (energy, workLoss) => `- ${energy} 精力，工作能力 - ${workLoss} ` }
                },
                messages: {
                    attend: '你在会上提出了建设性见解',
                    attendHighSocial: '你在会上提出了建设性见解，广受好评！',
                    ignore: '你整场会议都在神游'
                }
            },
            colleague_help: {
                title: '🙋 同事求助',
                choices: {
                    help: { text: '🤝 伸出援手', hint: (energy, social) => `- ${energy || 10} 精力，+${social || 10} 社交` },
                    decline: { text: '✋ 委婉拒绝', hint: (mental, socialLoss, workLoss) => `+ ${mental || 3} 精神，社交 - ${socialLoss}，工作能力 - ${workLoss} ` }
                },
                messages: {
                    help: '你帮同事解决了大麻烦，收获了感激',
                    decline: '你拒绝了额外负担，保护了心态'
                }
            },
            overtime_request: {
                title: '🔥 突降紧急需求',
                choices: {
                    accept: { text: '💪 保证完成', hint: (energy, workGain) => `- ${energy} 精力，工作能力 + ${workGain} ` },
                    refuse: { text: '🍵 明天再说', hint: (social, workLoss) => `- ${social || 5} 社交，工作能力 - ${workLoss} ` }
                },
                messages: {
                    accept: '你顶着压力追赶进度，工作能力提升了',
                    refuse: '你决定按时下班，但领导不太高兴'
                }
            },
            system_crash: {
                title: '💻 系统崩溃',
                choices: {
                    rest: { text: '🛌 趁机休息', hint: (energy) => `+ ${energy} 精力` },
                    help: { text: '🔧 帮忙排查', hint: (energy, social) => `- ${energy} 精力，+${social} 社交` }
                },
                messages: {
                    rest: '难得的带薪摸鱼时间',
                    help: '你展现了积极的工作态度'
                }
            },
            client_meeting: {
                title: '🤝 客户会议',
                choices: {
                    prepare: { text: '📝 充分准备', hint: (energy, social) => `- ${energy} 精力，+${social} 社交` },
                    wing_it: { text: '🤷 临场发挥', hint: (mental, social) => `+ ${mental} 精神，可能 - ${social} 社交` }
                },
                messages: {
                    prepare: '你在会议上表现出色，客户很满意',
                    prepareHighSocial: '你在会议上表现出色，客户很满意，老板也注意到了你！',
                    wing_it_bad: '会议效果不佳，客户有些不满',
                    wing_it_ok: '你凭借经验顺利应对了会议'
                }
            },
            office_drama: {
                title: '🎭 办公室八卦',
                choices: {
                    listen: { text: '👂 旁听吃瓜', hint: (mental, energy, social) => `+ ${mental} 精神，-${energy} 精力，社交 + ${social} ` },
                    avoid: { text: '🚶 远离是非', hint: (health, social) => `+ ${health} 健康，社交 - ${social} ` }
                },
                messages: {
                    listen: '听到了不少小道消息，心情愉悦',
                    avoid: '你选择专注于工作，远离办公室政治'
                }
            },
            presentation: {
                title: '📊 部门汇报',
                choices: {
                    lead: { text: '🎤 主动汇报', hint: (energy, social, workGain) => `- ${energy} 精力，+${social} 社交，工作能力 + ${workGain} ` },
                    support: { text: '🤝 辅助同事', hint: (energy, social, workGain) => `- ${energy} 精力，+${social} 社交，工作能力 + ${workGain} ` }
                },
                messages: {
                    lead: '你的汇报得到了领导的认可',
                    leadHighSocial: '你的汇报得到了领导的认可，同事们纷纷鼓掌！',
                    support: '你默默支持了同事，团队合作良好'
                }
            }
        },

        // 工作日事件
        daily_work: {
            description: {
                default: '又是努力搬砖的一天。你打算怎么度过？',
                commute_prefix: '通勤情况: ',
                commute_suffix: '\n\n今天的工作，你打算怎么安排？'
            },
            focus_work: {
                text: '💻 专注工作',
                // 动态提示: -精力，进度+%，PIP+分
                hint_pip: (energy, progress, pipBonus) => `- ${energy} 精力，进度 + ${progress}%，PIP + ${pipBonus} 分`,
                hint_normal: (energy, progress) => `- ${energy} 精力，进度 + ${progress}% `,
                messages: {
                    complete: (name) => `✅ 任务「${name}」完成！新任务已分配`,
                    progress: (gain, current) => `任务进度 + ${gain}%，当前 ${current}% `,
                    success_pto: '你全神贯注地完成了今日的工作\n✨ 获得1天带薪病假 (PTO)',
                    success: '你全神贯注地完成了今日的工作',
                    fail: '虽然很努力，但进度不如预期，有点受挫'
                }
            },
            slack_off: {
                text: '🐟 摸鱼划水',
                hint_pip: (energy, mental, pipPenalty, catchChance) => `- ${energy} 精力，+${mental} 精神，PIP - ${pipPenalty} 分，${catchChance}% 被抓`,
                hint_normal: (energy, mental, catchChance) => `- ${energy} 精力，+${mental} 精神，${catchChance}% 被抓`,
                messages: {
                    main_pip_critical: (pipPenalty, days) => `被发现摸鱼！PIP表现 - ${pipPenalty} 分，情况危急！(剩余${days}天)`,
                    main_pip_lucky: (pipPenalty, days) => `侥幸没被发现，但PIP表现 - ${pipPenalty} 分(剩余${days}天)`,
                    caught_warning: '被发现摸鱼，警告一次',
                    success_pto: (mental) => `成功摸鱼，精神 + ${mental} \n✨ 获得1天带薪病假(PTO)`,
                    success: (mental) => `成功摸鱼，精神 + ${mental} `
                }
            }
        },

        // 通用选项文本
        common: {
            accept: '接受',
            decline: '拒绝',
            continue: '继续',
            skip: '跳过',
            tryAgain: '再试一次',
            goHome: '回家',
            goToWork: '去上班',
            takeRest: '休息',
            seekHelp: '寻求帮助',
        },
        hospital_stay_choices: {
            paid_leave: {
                text: '🛌 遵医嘱治疗 (带薪假)',
                hint: (min, max, energy) => `PTO - 1，健康 + ${min} ~${max}，精力 + ${energy} `,
                message: (recovered) => `你安心休养了一天，健康 + ${recovered}。工资照常发放，也不用担心工作。`
            },
            rest_day: {
                text: '🛌 遵医嘱治疗 (休息日)',
                hint: (min, max, energy) => `仅支付住院费，健康 + ${min} ~${max}，精力 + ${energy} `,
                message: (recovered) => `在休息日安心治疗，健康 + ${recovered}。`
            },
            unpaid_leave: {
                text: '🛌 遵医嘱治疗 (无薪假)',
                hint: (percent, min, max) => `健康 + ${min} ~${max}，扣除${percent}% 月薪，增加解雇风险`,
                message: (recovered, chance) => `无薪修养中，健康 + ${recovered}。解雇风险 ${chance}% `,
                report: (pay) => `🚫 无薪病假: 将扣除本月工资约 $${pay} `,
                fired: '❌ 坏消息！你收到公司的解雇邮件。因长期缺勤被开除！',
                fired_no_ins: '❌ 坏消息！你收到公司的解雇邮件。因长期缺勤被开除！\n⚠️ 雇主医保将在次日失效！'
            },
            out_of_pocket: {
                text: '🛌 遵医嘱治疗 (自费)',
                hint: (min, max) => `消耗存款恢复，健康 + ${min} ~${max} `,
                message: (recovered) => `在医院继续接受治疗，健康 + ${recovered}。`
            },
            ama: {
                text: '🏃 强行出院 (AMA)',
                hint: (health, mental) => `需健康 >= ${health}，精神 - ${mental} `,
                message: '你签署了《违背医嘱出院书》强行离开。身体虽然还虚弱，但你自由了。\n⚠️ 注意：可能会复发！'
            }
        },
        day_rest_choices: {
            sleep: {
                text: '🛌 深度补觉',
                hint: (energy, health) => `+ ${energy} 精力，+${health} 健康`,
                message: '睡到自然醒，元气满满！错过午顿也值得'
            },
            cook: {
                text: '🍳 在家做饭',
                hint: (ingredients, health, mental) => `- ${ingredients} 食材，+${health} 健康，+${mental} 精神`,
                message: '亲手做了一顿丰盛的饭菜，既健康又放松！'
            },
            shop: {
                text: '🛒 超市大采购',
                hint: (cost, ingredients) => `- $${cost}，+${ingredients} 食材（休息日折扣）`,
                message: '趁休息日采购一周的食材'
            },
            delivery: {
                text: '🛵 送外卖兼职',
                hint: (money, energy) => `+ $${money}，-${energy} 精力`,
                message: (money) => `放弃休息去送外卖，赚了$${money} `
            },
            walk: {
                text: '🌳 城市漫游',
                hint: (cost, mental) => `- $${cost}，+${mental} 精神`,
                message: '在城市中漫无目的地闲逛，放松身心',
                message_lucky: (money) => `逛街时捡到$${money}！今天运气真好`
            }
        },
        night_choice: {
            title: '夜幕降临',
            description: '一天即将结束，你需要决定如何度过这个夜晚。明天还需要精力面对新的挑战。'
        },

        deep_night_idle: {
            title: '深夜',
            description: '城市渐渐安静了下来。你试图入睡，但现实总会在深夜给你一点惊喜。',
            choices: {
                continue: {
                    text: '继续',
                    hint: '进入下一天',
                },
            },
            messages: {
                continue: '深夜过去了。',
            },
        },
    },

};
