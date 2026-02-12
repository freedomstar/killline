/**
 * Killzone Survivor V2 - English Language Pack
 * Core translations for UI and common game text
 */

import { zh } from './zh.js';

const enOverrides = {
    data: {
        config: {
            endings: {
                financialFreedom: {
                    title: 'Financial Freedom',
                    subtitle: 'You Escaped the Gravitational Pull',
                    message: 'You have successfully accumulated enough capital to escape the trap of selling your time for survival. Your passive income from savings now exceeds your living expenses.'
                },
                bankrupt: {
                    title: 'Financial Collapse',
                    subtitle: 'Your Bank Account is Empty',
                    message: 'No savings, no income, credit cards frozen. You find yourself standing at the edge of the kill zone. In Country M, bankruptcy is just the beginning of the fall.'
                },
                homeless: {
                    title: 'Homeless',
                    subtitle: 'You Lost Your Last Shelter',
                    message: 'From apartment to car, from car to the streets. Without a fixed address, you cannot even fill out a job application.'
                },
                healthCollapse: {
                    title: 'Health Collapse',
                    subtitle: 'Your Body Cannot Take It Anymore',
                    message: 'Without health insurance, you chose to ignore every warning from your body. Eventually, the emergency room bill became the straw that broke the camel\'s back.'
                },
                mentalBreakdown: {
                    title: 'Mental Breakdown',
                    subtitle: 'You Gave Up',
                    message: 'Day after day of pressure, anxiety, and despair. When your mental defenses completely collapsed, you lost the will to keep fighting.'
                },
                exhaustion: {
                    title: 'Exhaustion',
                    subtitle: 'Your Body Issued a Final Warning',
                    message: 'Chronic sleep deprivation and overwork finally caused your body to go on strike.'
                },
                survived: {
                    title: 'Survivor',
                    subtitle: 'You Survived 365 Days',
                    message: 'Congratulations! You survived on Country M\'s kill line. But is this really a victory? Or just another year of struggle?'
                },
                debtSpiral: {
                    title: 'Death Spiral',
                    subtitle: 'The Dominoes Fell',
                    message: 'Starting with that unaffordable car repair, everything spiraled out of control. No car led to being late, being late led to job loss.'
                }
            },
            mental_restoration: {
                psychotherapy: {
                    title: 'Psychotherapy',
                    description: 'You decide to seek professional help. In this crazy city, admitting you need help takes courage.',
                    hint: (c, maxGain, gain) => `-$${c}, M cap+${maxGain}, M+${gain}`,
                    messages: {
                        tooPoor: 'You want therapy, but looking at your balance, you decide to tough it out.',
                        success: 'The therapist helps you realize what was crushing you. (M cap +{0})'
                    }
                },
                nature_retreat: {
                    title: 'Nature Retreat',
                    description: 'Drive to the nearest national park, turn off your phone, and listen to the wind.',
                    hint: (c, e, maxGain, gain) => `-$${c}, E-${e}, M cap+${maxGain}, M+${gain}`,
                    messages: {
                        tooPoor: 'You want to travel, but gas and accommodation costs kill the idea.',
                        success: 'From the mountaintop, those KPI and bills seem insignificant. (M cap +{0})'
                    }
                },
                meditation_insight: {
                    title: 'Meditation Insight',
                    description: 'In a deep breath, you suddenly understand what troubles you.',
                    choices: {
                        embrace: { text: 'Embrace Peace', hint: (g) => `M cap +${g}` }
                    },
                    messages: {
                        success: 'The obsession fades. Your soul grows stronger. (M cap +{0})'
                    }
                },
                volunteer_work: {
                    title: 'Volunteer Work',
                    description: 'Help at a food bank. Seeing people harder off gives you strength.',
                    hint: (e, maxGain, s) => `E-${e}, M cap+${maxGain}, S+${s}`,
                    messages: {
                        success: 'Helping others heals yourself. (M cap +{0})'
                    }
                }
            },
            tips: [
                'Tip: In Country M, an appendectomy can cost $30,000+',
                'Tip: The average person is only 2.5 months of savings away from bankruptcy',
                'Tip: Your credit score determines your life options',
                'Tip: Uber drivers have no benefits or protections',
                'Tip: In some states, employers can fire you without cause',
                'Tip: Unemployment benefits are typically only 40% of your salary',
                'Tip: Coffee gives temporary energy, but does not solve root problems',
                'Tip: Late-night scrolling brings happiness at tomorrow\'s energy cost'
            ],
            quotes: [
                '"Hard work leads to success" — Someone who has never been laid off',
                '"Save three months salary as emergency fund" — Assuming you can afford rent',
                '"Medical bills can be paid in installments" — Assuming you still have credit',
                '"The dream is open to everyone" — Terms and conditions apply',
                '"Unemployment is temporary" — But landlord will not wait',
                '"Stay positive" — This does not cost money',
                '"Work hard, play hard" — Assuming you have time to play',
                '"Coffee solves everything" — Except your bank account'
            ]
        },
        insuranceNames: {
            employer_basic: 'Employer Basic Plan',
            employer_premium: 'Employer Premium Plan',
            marketplace_bronze: 'Marketplace Bronze Plan',
            marketplace_silver: 'Marketplace Silver Plan',
            marketplace_gold: 'Marketplace Gold Plan',
            medicaid: 'Medicaid',
            none: 'No Insurance'
        },
        insuranceDescriptions: {
            employer_basic: (cost, ded) => `Company pays most, but you pay $${cost}/month. Deductible is $${ded}.`,
            employer_premium: (cost, ded) => `$${cost}/month, less worry when sick.`,
            marketplace_bronze: (cost, ded) => `Cheap premiums, but you pay $${ded} if sick. "Bankruptcy prevention insurance".`,
            marketplace_silver: (cost, ded) => `$${cost}/month, pay $${ded} deductible first.`,
            marketplace_gold: (cost, ded) => `$${cost}/month, good insurance costs money.`,
            medicaid: 'Government low-income insurance. Free care, but limited providers and long waits.',
            none: 'Gambling on your health. Serious illness means immediate bankruptcy.'
        },
        carInsuranceNames: {
            liability: 'Liability Only',
            full_coverage: 'Full Coverage',
            none: 'No Car Insurance'
        },
        carInsuranceDescriptions: {
            liability: 'Covers other party. 40% reimbursement for your repairs.',
            full_coverage: (ded) => `Covers both parties. Pay $${ded} deductible per incident.`,
            none: 'Saved on premiums. Accident or police stop means trouble.'
        },
        rentersInsuranceDescription: (cost) => `$${cost}/month for peace of mind. Covers fire and theft.`,
        assetNames: {
            gold: 'Gold',
            sp500: 'S&P 500',
            tech_giant: 'Tech Giants ETF',
            energy: 'Energy ETF',
            btc: 'Bitcoin',
            eth: 'Ethereum',
            solana: 'Solana',
            meme_coin: 'Meme Coin',
            biotech: 'Biotech ETF',
            reit: 'REIT'
        },
        assetUnits: {
            gold: 'oz',
            sp500: 'shares',
            tech_giant: 'shares',
            energy: 'shares',
            btc: 'coins',
            eth: 'coins',
            solana: 'coins',
            meme_coin: 'coins',
            biotech: 'shares',
            reit: 'shares'
        },
        assetDescriptions: {
            gold: 'Traditional safe-haven asset, rises during panic',
            sp500: 'Tracks top 500 US companies, stable investment',
            tech_giant: 'Includes FAANG and other tech leaders',
            energy: 'Oil and gas companies',
            btc: 'Crypto leader, high volatility',
            eth: 'Smart contract platform',
            solana: 'High-performance blockchain',
            meme_coin: 'Extreme risk, get rich or go to zero',
            biotech: 'Drug R&D, another form of gambling',
            reit: 'Real estate income, rate-sensitive'
        },
        housing: {
            apartment: { name: 'Apartment', description: 'Standard studio, fully equipped. Your last dignity in the city.' },
            cheapRoom: { name: 'Cheap Room', description: 'Narrow shared room, poor soundproofing. At least there is a roof.' },
            car: { name: 'Car', description: 'Back seat is your bed. Worried about police, cold winters, hot summers.' },
            homeless: { name: 'Homeless', description: 'Park benches or bridges. No security, no dignity.' }
        },
        jobs: {
            fulltime: { name: 'Full-time' },
            parttime: { name: 'Part-time' },
            gig: { name: 'Gig' },
            unemployed: { name: 'Unemployed' },
            fired: { name: 'Fired' }
        },
        medical: {
            minuteClinic: { name: 'Minute Clinic', desc: 'Cheap and quick, for colds and minor issues.' },
            urgentCare: { name: 'Urgent Care', desc: 'No appointment, cheaper than ER, watch for out-of-network.' },
            pcp: { name: 'Primary Care', desc: 'Formal treatment, reasonable cost, but must wait.' },
            er: { name: 'Emergency Room', desc: 'Takes everyone if you can pay the bill.' },
            otc: { name: 'OTC Medicine', desc: 'Hit or miss, may work for minor issues.' }
        },
        meals: {
            fastFood: { name: 'Fast Food' },
            homeCook: { name: 'Home Cooking' },
            restaurant: { name: 'Fine Dining' },
            skip: { name: 'Skip/Save' },
            convenience: { name: 'Convenience Store' }
        },
        lunch: {
            bento: { name: 'Packed Lunch', hint: (cfg) => `E+${cfg.energyEffect} H+${cfg.healthEffect} M+${cfg.mentalEffect}` },
            fastfood: { name: 'Fast Food', hint: (cfg) => `H${cfg.healthEffect} M+${cfg.mentalEffect} -$${cfg.cost}` },
            skip: { name: 'Skip Lunch', hint: (cfg) => `H${cfg.healthEffect}, Save money` },
            business: { name: 'Business', hint: (cfg) => `-$${cfg.cost} M+${cfg.mentalEffect} S+${cfg.socialEffect}` },
            salad: { name: 'Salad', hint: (cfg) => `-$${cfg.cost} H+${cfg.healthEffect} E+${cfg.energyEffect}` },
            sandwich: { name: 'Sandwich', hint: (cfg) => `-$${cfg.cost} E+${cfg.energyEffect}` },
            hospital_cafeteria: { name: 'Hospital Food', hint: (cfg) => `-$${cfg.cost} H+${cfg.healthEffect} E+${cfg.energyEffect}` }
        },
        healthStatus: {
            normal: { name: 'Normal' },
            cold: { name: 'Minor Cold' },
            sick: { name: 'Severe Cold' },
            critical: { name: 'Critical' }
        },
        marketNews: {
            ai_breakthrough: { title: 'AI Breakthrough', description: 'Next-gen model capability surges' },
            bank_crisis: { title: 'Banking Crisis', description: 'Banks face liquidity issues' },
            crypto_ban: { title: 'Major Country Bans Crypto', description: 'Global panic sell-off in crypto' },
            crypto_etf_approved: { title: 'Bitcoin ETF Approved', description: 'Institutional funds flood in' },
            defi_hack: { title: 'DeFi Protocol Hacked', description: 'Large-scale theft shocks crypto market' },
            drug_trial_fail: { title: 'Clinical Trial Failure', description: 'Flagship biotech stock crashes' },
            election_year: { title: 'Election-Year Policy Boost', description: 'Stimulus promises lift energy and defense sectors' },
            eth_upgrade: { title: 'Ethereum Major Upgrade', description: 'Gas fees drop significantly' },
            exchange_hack: { title: 'Major Exchange Hacked', description: 'User asset security concerns rise' },
            fed_rate_cut: { title: 'Fed Cuts Rates', description: 'Monetary policy turns looser' },
            fed_rate_hike: { title: 'Fed Hikes Rates', description: 'Up 25 basis points' },
            fda_approval: { title: 'FDA Approves Drug', description: 'Biotech sector rallies' },
            geopolitical_tension: { title: 'Geopolitical Tension Rises', description: 'Risk-off sentiment strengthens' },
            green_energy: { title: 'Green Energy Bill Passed', description: 'Traditional energy stocks pressured' },
            housing_bubble_burst: { title: 'Housing Bubble Bursts', description: 'Prices plummet' },
            inflation_spike: { title: 'Inflation High', description: 'CPI exceeds expectations' },
            interest_rate_hike: { title: 'Aggressive Rate Hike', description: 'Borrowing gets much more expensive' },
            job_report_strong: { title: 'Strong Jobs Report', description: 'Labor market remains hot' },
            market_rally: { title: 'Broad Market Rally', description: 'Investor confidence pushes markets up' },
            meme_frenzy: { title: 'Meme Coin Frenzy', description: 'Meme token prices spike hard' },
            oil_discovery: { title: 'Major Oil Field Discovered', description: 'Energy sector rallies' },
            oil_surge: { title: 'OPEC Cuts', description: 'Oil prices rise' },
            pandemic_scare: { title: 'Pandemic Alert', description: 'Global health warning boosts biotech attention' },
            peace_agreement: { title: 'Major Peace Deal', description: 'Global markets cheer' },
            recession_fear: { title: 'Recession Fears', description: 'Economic indicators weaken' },
            solana_network_outage: { title: 'Solana Network Outage', description: 'Trading paused during emergency fix' },
            tech_earnings_beat: { title: 'Tech Giants Beat', description: 'Quarterly revenue hits new highs' },
            tech_layoffs: { title: 'Mass Layoffs', description: '10,000+ job cuts announced' },
            trade_war: { title: 'Trade War Escalation', description: 'Tariff barriers disrupt supply chains' }
        },
        commuteOptions: {
            car: { name: 'Drive', hint: (opt) => `Fuel ${opt.fuel || '?'}/${opt.capacity || '?'}` },
            bus: { name: 'Bus', hint: (opt) => `-$${opt.cost}, ${opt.lateChance * 100}% late chance` },
            walk: { name: 'Walk', hint: (opt) => `H+${opt.healthEffect}, definitely late` },
            hospital_stay: { name: 'Hospital', hint: 'Rest' }
        },
        housingTypes: {
            apartment: 'Apartment',
            cheapRoom: 'Cheap Room',
            car: 'Car',
            homeless: 'Homeless'
        },
        jobTypes: {
            fulltime: 'Full-time',
            parttime: 'Part-time',
            gig: 'Gig',
            unemployed: 'Unemployed',
            fired: 'Fired'
        },
        eventTypes: {
            layoff: 'Layoff',
            bill: 'Bill Due',
            accident: 'Accident',
            opportunity: 'Opportunity',
            daily: 'Daily',
            health: 'Health',
            night: 'Night',
            work: 'Work',
            system: 'System',
            bonus: 'Bonus'
        },
        night_choices: {
            sleep: { text: 'Sleep Well', hint: (r) => `Tomorrow E${r > 0 ? `+${r}` : r}` },
            phone: { text: 'Stay Up', hint: (m, e) => `M+${m}, Tomorrow E${e > 0 ? `+${e}` : e}` },
            overtime: { text: 'Work OT', hint: (m, men, p, e) => `+$${m} M-${men} +${p * 100}% E${e > 0 ? `+${e}` : e}` },
            entertainment: { text: 'Go Out', hint: (c, m, e) => `-$${c} M+${m} E${e > 0 ? `+${e}` : e}` }
        },
        artifacts: {
            dropshipping_bot: {
                name: 'Side Hustle Bot',
                description: 'Daily income+${0}, mental -{1} from complaints.',
                log: (income, mood) => `Bot: +$${income} -${mood} mental`
            },
            lucky_ring: {
                name: 'Lucky Ring',
                description: '+{0}% success rate on probability events.'
            },
            coffee_drip: {
                name: 'Coffee IV',
                description: 'Energy locked at >= {0}, never zero.'
            },
            piggy_bank: {
                name: 'Piggy Bank',
                description: 'No spending -> +${0} income.'
            },
            intern_badge: {
                name: 'Intern Badge',
                description: 'Absorb one layoff (S -{0}).'
            },
            golden_parachute: {
                name: 'Golden Parachute',
                description: 'Auto stop-loss at -{0}% drop.'
            }
        }
    },

    finance: {
        debt: 'Debt',
        totalDebt: 'Total Debt',
        pendingInstallment: 'Pending',
        repay: 'Repay',
        repaySuccess: (amount) => `Repaid $${amount}`,
        repayEmpty: 'No debt to repay',
        newDebtNotice: (amount, source) => `New debt $${amount} (${source})`,
        interestNotice: (amount) => `Interest accrued $${amount}`,
        interest: 'Interest',
        medical: 'Medical',
        commute: 'Commute',
        daily: 'Daily',
        fine: 'Fine',
        overflow: 'Overdraft',
        other: 'Other',
        autoRepay: {
            title: 'Auto Repay',
            enable: 'Enable auto repay',
            keepCash: 'Keep cash',
            maxDaily: 'Max daily (0=unlimited)',
            tips: 'Auto repay debt daily, prioritizing high interest.',
            dailyLog: (amount, keepCash) => `Auto -$${amount} (keep $${keepCash})`,
            setupPrompt: 'Set up auto repay now or adjust later.'
        },
        max: 'Max',
        manualRepayTip: '(You can repay manually at any time)'
    },

    game: {
        taskNames: ['Project Dev', 'Report', 'Data Analysis', 'Client', 'Maintenance', 'Review'],
        trade: {
            systemError: 'System Error',
            invalidAsset: 'Invalid Asset',
            insufficientFunds: 'Insufficient Funds',
            insufficientHolding: 'Insufficient Holding',
            buySuccess: (qty, unit, name, cost) => `Bought ${qty} ${unit} ${name} for $${cost.toLocaleString()}`,
            sellSuccess: (qty, unit, name, value, profit) => `Sold ${qty} ${unit} ${name} for $${value.toLocaleString()}, ${profit}`,
            profit: (amount, pct) => `Profit $${amount.toFixed(2)} (+${pct}%)`,
            loss: (amount, pct) => `Loss $${Math.abs(amount).toFixed(2)} (${pct}%)`
        },
        log: {
            gameInit: (seed) => `[Game] Init, Seed: ${seed}`,
            newTask: (name, diff, days) => `[Task] ${name}, Diff ${diff}, ${days} days`,
            marketNews: (title, change) => `[News] ${title} | ${change > 0 ? '+' : ''}${change}`,
            payday: (gross, net, tax) => `[Pay] Gross $${gross} | Net $${net} (Tax $${tax})`,
            rentPaid: (amount) => `[Rent] -$${amount}`,
            insurancePaid: (amount) => `[Insurance] -$${amount}`
        },
        artifactTriggers: {
            side_job_bot: (bonus) => `Bot: +$${bonus}`,
            piggy_bank: (bonus) => `Piggy: +$${bonus}`,
            golden_parachute: (name, price, proceeds) => `${name} stop-loss @$${price}, recovered $${proceeds}`
        },
        finance: {
            payday: (gross, net, tax) => `Payday: $${gross} -> $${net} (tax $${tax})`,
            rentPaid: (amount) => `Rent -$${amount}`,
            utilityPaid: (amount) => `Utilities -$${amount}`,
            insurancePaid: (amount) => `Insurance -$${amount}`,
            medicaidApproved: 'Medicaid approved!',
            medicaidDenied: 'Medicaid denied'
        },
        housing: {
            pickTitle: 'Choose Housing',
            pickSubtitle: 'Select housing first, then artifact.',
            requestChange: 'Change Housing',
            cancelChange: 'Cancel',
            nextCycleEffective: 'Request submitted, effective next cycle',
            pendingTo: (name) => `Moving to: ${name}`,
            changeCanceled: 'Request canceled',
            moveCompleted: (name) => `Moved! New: ${name}`,
            noAlternative: 'No alternatives',
            insufficientCash: (req) => `Need $${req} to move`
        }
    },

    ui_static: {
        help: {
            title: 'Guide',
            goals_title: 'Objective',
            goals_text: 'Survive. Keep <b>Savings > 0</b>.',
            stats_title: 'Stats',
            stats_energy: '<b>Energy</b>: Action points',
            stats_mental: '<b>Mental</b>: Sanity level',
            stats_health: '<b>Health</b>: Physical condition',
            work_title: 'Work',
            work_text: 'Watch out for PIP (Performance Improvement Plan).'
        },
        start: {
            title: 'Killzone Survivor',
            subtitle: 'KILLZONE SURVIVOR',
            tagline: '"One layoff from homelessness"',
            intro_1: 'You are a Silicon Valley tech worker.',
            intro_2: 'Savings look sufficient, life looks stable.',
            intro_3: 'But behind the dream lies a <span class="danger">kill line</span>.',
            intro_footer: 'Energy | Mental | Savings',
            start_btn: 'Start Game',
            seed_label: 'Seed (optional):',
            seed_placeholder: 'Random if empty',
            dev_tools: 'Dev Tools'
        },
        game_header: {
            day: (n) => `Day ${n}`,
            energy: 'Energy',
            mental: 'Mental',
            health: 'Health',
            money: 'Savings',
            housing: 'Housing',
            job: 'Job',
            social: 'Social',
            work_efficiency: 'Efficiency'
        },
        finance: {
            housing: 'Housing',
            insurance: 'Insurance',
            artifact: 'Artifact',
            ingredients: 'Food',
            monthly_bill: 'Monthly Bill',
            next_bill_days: (days) => `Next: ${days}d`,
            income: 'Salary',
            task: 'Task',
            difficulty: 'Diff',
            meal: 'Packed Lunch',
            investment: 'Invest'
        },
        tabs: {
            home: 'Survive',
            assets: 'Invest',
            insurance: 'Insurance',
            status: 'Status'
        },
        modals: {
            select_save: 'Select Save',
            save_game: 'Save Game',
            cancel: 'Cancel',
            confirm: 'Confirm',
            dev_editor: 'Edit',
            news_detail: '📰 Market Intel'
        },
        dev_editor: {
            money: 'Savings ($)',
            energy: 'Energy (0-100)',
            mental: 'Mental (0-100)',
            health: 'Health (0-100)',
            social: 'Social (0-100)',
            efficiency: 'Efficiency (0-100)',
            save_btn: 'Save'
        },
        status_page: {
            title: 'Status',
            save_mgmt: 'Saves',
            save_btn: 'Save',
            return_btn: 'Menu',
            bio_stats: 'Biology',
            career: 'Career',
            housing: 'Housing',
            finance: 'Finance',
            days_survived: 'Days',
            max_wealth: 'Max Wealth',
            world_seed: 'Seed',
            housing_type: 'Housing',
            monthly_rent: 'Rent',
            cash_balance: 'Cash',
            total_debt: 'Debt',
            credit_score: 'Credit'
        },
        insurance_page: {
            title: 'Insurance',
            health_title: 'Health',
            current_plan: 'Current',
            monthly_premium: 'Monthly',
            deductible_label: 'Deductible',
            change_plan_btn: 'Change',
            car_title: 'Car',
            renters_title: 'Rental'
        },
        assets_page: {
            title: 'Investments',
            sentiment_label: 'Sentiment:',
            cash_label: 'Cash',
            portfolio_label: 'Portfolio',
            total_assets_label: 'Net Worth',
            tab_watchlist: 'Watchlist',
            tab_gold: 'Gold',
            tab_stock: 'Stocks',
            tab_crypto: 'Crypto'
        },
        ending_screen: {
            title: 'Game Over',
            subtitle: 'Eliminated',
            default_message: 'Middle class to homeless: one layoff, one illness, one accident.',
            restart_btn: 'Try Again'
        },
        trade_modal: {
            buy_title: 'Buy',
            sell_title: 'Sell',
            price_label: 'Price:',
            holding_label: 'Holding:',
            quantity_label: 'Qty:',
            quantity_placeholder: 'Amount',
            total_label: 'Total:',
            cash_label: 'Cash:',
            confirm_btn: 'Trade',
            max_btn: 'Max'
        }
    },

    ui: {
        messageHistory: {
            title: 'Messages',
            empty: 'No messages',
            dailySummary: 'Daily'
        },
        toast: {
            seedCopied: 'Seed copied',
            copiedSuccess: 'Copied',
            copyFailed: 'Copy failed',
            loadFailed: 'Load failed',
            saveFailed: 'Save failed',
            saveSuccess: (id) => `Saved slot ${id}`,
            loadSuccess: (id) => `Loaded slot ${id}`,
            newGameStarted: (id) => `New game (Slot ${id})`,
            invalidQuantity: 'Enter valid amount',
            socialLow: 'Social too low!'
        },
        tutorial: {
            welcome: 'Welcome to the Game! Highlighted areas are clickable too!'
        },
        artifacts: {
            title: 'Artifacts',
            emptySlot: '[Empty]',
            selectionTitle: 'Select'
        },
        confirm: {
            returnToTitle: 'Return to menu? Unsaved progress lost.',
            deleteSlot: (id) => `Delete slot ${id}?`,
            defaultTitle: 'Confirm',
            defaultMessage: 'Are you sure?'
        },
        modal: {
            selectHealthPlan: 'Select Health Plan',
            selectCarPlan: 'Select Car Plan',
            saveGame: 'Save',
            loadGame: 'Load',
            confirm: 'Confirm'
        },
        insurance: {
            employerBadge: 'Employer',
            personalBadge: 'Personal',
            insured: 'Insured',
            uninsured: 'Uninsured',
            buyInsurance: (p) => `Buy ($${p}/mo)`,
            nextMonthActive: 'Next month',
            premiumHint: 'Premium:',
            deductibleHint: 'Deductible:',
            coinsuranceHint: 'Coinsurance:',
            healthPlanNotice: '⏳ <strong>Effective Next Month</strong>: Changes apply on next billing day. Current plan remains active until then.',
            carPlanNotice: '⏳ <strong>Effective Next Month</strong>: Plan switch applies on next billing day. Repair costs use the plan active at incident time.'
        },
        save: {
            slot: (id) => `Slot ${id}`,
            autoSlot: 'Auto',
            emptySlot: 'Empty',
            day: (d) => `Day ${d}`,
            continueBtn: 'Continue',
            newGameBtn: 'New Game',
            current: '(Current)',
            overwrite: 'Overwrite',
            saveHere: 'Save Here'
        },
        status: {
            unknown: 'Unknown',
            noEffect: 'No effect',
            energyRec: 'Energy Rec',
            mental: 'Mental',
            health: 'Health',
            privateCarLabel: 'Car',
            publicTransitLabel: 'Transit',
            ptoLabel: (days) => `PTO: ${days}d`,
            workEfficiency: 'Efficiency'
        },
        assets: {
            marketSentiment: 'Sentiment:',
            sentimentNeutral: 'Neutral',
            sentimentExtremeFear: 'Extreme Fear',
            sentimentFear: 'Fear',
            sentimentExtremeGreed: 'Extreme Greed',
            sentimentGreed: 'Greed',
            riskLevel: {
                low: 'Low',
                medium: 'Medium',
                high: 'High',
                extreme: 'Extreme'
            },
            buy: 'Buy',
            sell: 'Sell',
            holding: 'Holding',
            value: 'Value',
            profitLoss: 'P/L',
            avgCost: 'Avg Cost',
            trend: 'Trend',
            favorite: 'Favorite',
            unfavorite: 'Unfavorite',
            todayPnl: 'Today P/L',
            totalPnl: 'Total P/L',
            portfolioTrend: 'Portfolio Trend',
            purchased: 'Purchased',
            favorited: 'Watchlist',
            noWatchlist: 'No assets in watchlist<br>Mark assets with star to add them here',
            noHistory: 'Insufficient Historical Data',
            chartDaily: 'D',
            chartWeekly: 'W',
            todayPnl: 'Today P/L',
            weeklyPnl: 'Weekly P/L',
            totalPnl: 'Total P/L',
            needMoreData: 'Need more data'
        },
        validation: {
            selectLunch: 'Lunch',
            selectAction: 'Action',
            selectCommute: 'Commute',
            pleaseComplete: 'Complete selection first'
        }
    },

    events: {
        typeLabels: {
            work: 'Work',
            daily: 'Daily',
            opportunity: 'Opportunity',
            health: 'Health',
            accident: 'Accident',
            layoff: 'Layoff',
            night: 'Night',
            special: 'Special'
        },
        hospital_stay: {
            title: 'Hospital',
            description: (h, t, days, cost) => `Hospitalized... Health: ${h}/${t} (~${days}d) Fee: $${cost}/day`,
            choices: {
                paidLeave: { text: 'Paid Leave', hint: 'Use PTO, salary unchanged' },
                rest_day: { text: 'Rest Day', hint: 'Pay room fee only' },
                unpaid_leave: { text: 'Unpaid', hint: 'No salary, risk up' },
                out_of_pocket: { text: 'Self-pay', hint: 'Use savings' },
                ama: { text: 'Leave AMA', hint: 'Against medical advice' }
            },
            messages: {
                paidLeave: 'Resting in hospital, salary continues.',
                fired: 'Fired for absence!',
                ama: 'You signed AMA and left. May relapse!'
            }
        },
        rent_due: {
            title: 'Rent Due',
            description: (cost) => `Rent $${cost} is due.`,
            choices: {
                pay: { text: 'Pay Rent', hint: (c) => `-$${c}` },
                negotiate: { text: 'Negotiate', hint: 'Risk eviction' }
            },
            messages: {
                paid: (c) => `Paid $${c}`,
                negotiateFail: 'Evicted!'
            }
        },
        common: {
            accept: 'Accept',
            decline: 'Decline',
            continue: 'Continue',
            skip: 'Skip'
        }
    },

    common: {
        accept: 'Accept',
        decline: 'Decline',
        continue: 'Continue',
        skip: 'Skip',
        goHome: 'Home',
        goToWork: 'Work',
        takeRest: 'Rest',
        seekHelp: 'Help'
    },

    hospital_stay_choices: {
        paid_leave: {
            text: 'Paid Leave',
            hint: (min, max, e) => `PTO-1 H+${min}-${max} E+${e}`,
            message: (r) => `Recovered H+${r}. Salary unchanged.`
        }
    },

    day_rest_choices: {
        sleep: {
            text: 'Deep Sleep',
            hint: (e, h) => `E+${e} H+${h}`,
            message: 'Fully recharged!'
        },
        cook: {
            text: 'Cook',
            hint: (i, h, m) => `-${i} food H+${h} M+${m}`,
            message: 'Healthy and relaxing!'
        }
    },

    night_choice: {
        title: 'Night Falls',
        description: 'Day ends. How to spend tonight?'
    },

    deep_night_idle: {
        title: 'Late Night',
        description: 'City quiets down. Time to rest.',
        choices: {
            continue: { text: 'Continue', hint: 'Next day' }
        },
        messages: {
            continue: 'Night passes.'
        }
    }
};

const enMoreOverrides = {
    data: {
        commute: {
            car: { name: 'Drive', hint: (opt) => `Fuel ${opt.fuel || '?'}/${opt.capacity || '?'}` },
            car_repair: { name: 'Repair Then Drive', hint: (repairCost, fuelCost) => `-$${repairCost + fuelCost} total` },
            car_refuel: { name: 'Refuel Then Drive', hint: (fuelCost) => `-$${fuelCost} fuel` },
            bus: { name: 'Bus', hint: (opt) => `-$${opt.cost}, ${(opt.lateChance * 100).toFixed(0)}% late chance` },
            walk: { name: 'Walk', hint: (opt) => `H+${opt.healthEffect}, definitely late` },
            too_expensive: (need) => `Need $${need} to choose this option`,
            unavailable: 'This option is currently unavailable',
            hospital_stay: { name: 'Hospital Stay', hint: 'Rest and recover' }
        },
        commute_messages: {
            cost: (amount) => `Commute cost: -$${amount}`,
            health: (amount) => `Health ${amount > 0 ? '+' : ''}${amount}`,
            late: 'You arrived late.',
            pip: 'PIP pressure increased due to lateness.'
        },
        periods: {
            day: { name: 'Daytime', description: '08:00 - 18:00' },
            night: { name: 'Night', description: '18:00 - 08:00' },
            deep_night: { name: 'Late Night', description: '00:00 - 08:00' }
        },

        lunch_hints: {
            not_prepared: 'No lunch prepared',
            sold_out: 'Sold out today',
            restaurant_full: 'Restaurant is full'
        },
        night_choices: {
            phone_social: { text: 'Call a Friend' },
            prepareMeal: { text: 'Prepare Tomorrow\'s Lunch' },
            grocery: { text: 'Buy Ingredients at Grocery Store' }
        },
        sarcasmQuotes: [
            '"Work hard and you\'ll succeed" - Someone never laid off',
            '"Save three months of salary" - If you can even afford rent',
            '"Medical bills can be paid in installments" - If your credit still exists',
            '"The dream is open to everyone" - Terms and conditions apply',
            '"Unemployment is temporary" - Your landlord disagrees',
            '"Stay positive" - At least this one is free',
            '"Work hard, play hard" - Assuming you have time to play',
            '"Coffee solves everything" - Except your bank balance'
        ],
        dailyTips: [
            'Tip: In Country M, an appendectomy can cost $30,000+',
            'Tip: Average households are roughly 2.5 months from bankruptcy',
            'Tip: Credit score determines many life options',
            'Tip: Gig workers usually have no traditional benefits',
            'Tip: In some states, employers can terminate without cause',
            'Tip: Unemployment benefits are often around 40% of salary',
            'Tip: Coffee boosts energy temporarily, not fundamentally',
            'Tip: Late-night scrolling borrows from tomorrow\'s energy'
        ],
        medicalSystem: {
            insuranceTypes: {
                employer: 'Employer Insurance',
                none: 'Uninsured'
            },
            treatmentOptions: {
                minuteClinic: { name: 'Minute Clinic', description: 'Cheap and fast for minor illness.' },
                urgentCare: { name: 'Urgent Care', description: 'No appointment needed; cheaper than ER but watch out-of-network.' },
                pcp: { name: 'Primary Care (PCP)', description: 'Standard care and moderate cost, but requires waiting.' },
                er: { name: 'Emergency Room (ER)', description: 'Fast treatment with very high billing risk.' },
                otc: { name: 'OTC Medicine', description: 'Low-cost gamble for minor symptoms.' }
            },
            healthStages: {
                normal: 'Healthy',
                sick_minor: 'Mild Symptoms',
                sick_moderate: 'Worsening Symptoms',
                sick_severe: 'Medical Emergency'
            }
        },
        mealSystem: {
            fastFood: 'Fast Food',
            homeCook: 'Home Cooked',
            restaurant: 'Restaurant',
            skip: 'Skip / Save',
            convenience: 'Convenience Store'
        },
        healthStatuses: {
            normal: 'Normal',
            cold: 'Mild Cold',
            sick: 'Severe Cold',
            critical: 'Critical'
        },
        artifacts: {
            mom_credit_card: {
                name: 'Magic Credit Card',
                description: 'Activates when cash is below ${1}. All spending reduced by {0}%.',
                log: (saved) => `Magic Card discount: -$${saved}`
            },
            gopro_camera: {
                name: 'Action Camera',
                description: 'Monetize every injury. Gain ${0} when losing health. Medical costs x{1}.'
            },
            side_job_bot: {
                name: 'Side Job Bot',
                description: 'Whenever you gain money, gain extra +$${0}.'
            },
            gig_cap: {
                name: 'Hustler Cap',
                description: 'All actions that consume energy get +${0} base return.'
            },
            bull_plushie: {
                name: 'Bull Plushie',
                description: 'For every ${1} you hold, money gains +{0}%.'
            },
            grinder_tie: {
                name: 'Grindset Tie',
                description: 'Work actions gain +{0} mental, but health loss x{1}.'
            },
            blood_contract: {
                name: 'Blood Contract',
                description: 'When health is below {0}%, all gains are multiplied by x{1}.'
            },
            jammed_copier: {
                name: 'Jammed Copier',
                description: 'If today\'s task equals yesterday\'s, repeat the same progress automatically.'
            },
            leverage_jack: {
                name: 'Leverage Jack',
                description: 'Investment gains x{0}, losses also x{0}.'
            },
            insider_phone: {
                name: 'Insider Phone',
                description: '{0}% chance to receive {1}% accurate next-day market intel (with cooldown).'
            },
            actuary_glasses: {
                name: 'Actuary Glasses',
                description: 'No insurance denial, out-of-network treated as in-network, car repair costs halved.'
            },
            wellness_tea: {
                name: 'Wellness Tea Set',
                description: 'Recover {0} health and {1} mental every day.',
                log: (h, m) => `Tea set: +${h} health, +${m} mental`
            },
            neural_chip: {
                name: 'Neural Implant',
                description: 'Consume {0} health daily, recover {1} energy, fixed +{2}% work progress daily.',
                log: (h, e, p) => `Neural implant: -${h} health, +${e} energy, +${p}% progress`
            },
            quantum_meditation_mat: {
                name: 'Quantum Meditation Mat',
                description: 'For every {1} mental recovered, also recover {0} health.'
            },
            streamer_mic: {
                name: 'Streamer Mic',
                description: 'Monetize your mood. For every {1} mental recovered, gain ${0}.'
            },
            super_vitamin: {
                name: 'Super Vitamin',
                description: 'For every {1} health recovered, also recover {0} mental.'
            },
            stray_cat: {
                name: 'Stray Cat',
                description: 'A cold ginger cat. Cost ${0} daily for food, but restores {1} Mental every morning. Every {2} days, it permanently increases Max Mental by {3} (up to {4}).',
                log: (cost, mental) => `🐱 Feed the cat -$${cost}, Mental +${mental}.`,
                log_max: (gain) => `🐱 The cat\'s presence warms your heart (Max Mental +${gain}).`
            },
            rent_increase_bonus: {
                title: 'Rent Hike Compensation',
                description: 'Rent increased, but you receive an odd compensation opportunity.',
                choices: {
                    get: 'Get new artifact: {0}',
                    swap: 'Swap artifact: {0} -> {1}',
                    skip: 'No thanks (keep current setup)'
                },
                messages: {
                    get: 'You obtained artifact: {0}',
                    swap: 'You swapped {0} for {1}',
                    skip: 'You decline the unexpected offer.'
                }
            }
        },
        mental_restoration: {
            psychotherapy: {
                title: 'Psychotherapy',
                description: 'You seek professional help. Admitting you need support takes courage.',
                messages: {
                    tooPoor: 'You want therapy, but your balance says no.',
                    success: 'The therapist helps you reframe the weight you carry. (Max mental +{0})'
                }
            },
            nature_retreat: {
                title: 'Nature Retreat',
                description: 'Drive to a national park, switch off your phone, and listen to the wind.',
                messages: {
                    tooPoor: 'Travel is too expensive right now.',
                    success: 'From the mountaintop, KPI and bills feel smaller. (Max mental +{0})'
                }
            },
            meditation_insight: {
                title: 'Moment of Clarity',
                description: 'A deep breath helps you understand what has been weighing on you.',
                choices: {
                    embrace: {
                        text: 'Embrace the Calm'
                    }
                },
                messages: {
                    success: 'Your obsession fades and your core becomes steadier. (Max mental +{0})'
                }
            },
            volunteer_work: {
                title: 'Community Volunteering',
                description: 'You help distribute food and feel strength from shared resilience.',
                messages: {
                    success: 'Helping others becomes a way to heal yourself. (Max mental +{0})'
                }
            }
        }
    },

    game: {
        housing: {
            insufficientCashShort: (need) => `Need $${need}`
        },
        artifactDaily: {
            ticker_rumor_label: '[Rumor]',
            ticker_news_title: 'Market News'
        },
        foreseeing: {
            rentWarning: (days) => `Rent due in ${days} day(s).`,
            rentReminder: 'Rent is due today.',
            utilityWarning: (days) => `Utility bill due in ${days} day(s).`,
            utilityReminder: 'Utility bill is due today.',
            insuranceWarning: (days) => `Insurance premium due in ${days} day(s).`,
            insuranceReminder: 'Insurance premium is due today.',
            insuranceChangeWindow: 'Today is the last day to submit insurance changes for this cycle.',
            pipOmen: 'Your boss seems unusually tense and keeps checking progress charts.',
            workMoodWarning: (val) => `Current work stress indicator: ${val}`,
            rumorLine: (line) => `Rumor: ${line}`,
            rumors: [
                'You may want to avoid risky reimbursement claims this week.',
                'People say fuel prices could rise soon, commute costs may increase.',
                'Tech sector volatility may spike after upcoming headlines.',
                'Layoff chatter is getting louder. Keep your profile low.'
            ],
            eveningOmenUtility: (v) => `Something feels off about the utility meter (${v}).`,
            eveningOmenMarket: (v) => `Market mood index tonight: ${v}.`,
            eveningOmenNoise: 'Suspicious movement near the neighborhood. Lock your doors tonight.',
            eveningOmenHot: 'The air feels unnaturally hot tonight.',
            eveningOmenCold: 'The cold feels sharper than usual tonight.',
            eveningOmenWork: 'Work chat is unnaturally quiet. Something may be brewing.',
            eveningOmenSocial: 'Friends are whispering about trouble tomorrow.',
            utilityShock: (pct) => `Utility rate spike: +${pct}% expected.`,
            marketRumorTitle: (name) => `Rumor: ${name}`,
            marketRumorDesc: (desc) => `${desc}`,
            marketConfirmTitle: (name) => `Confirmed: ${name}`,
            marketConfirmDesc: (desc) => `${desc}`
        },
        nightResults: {
            sleep: (energy) => `You slept early and restored ${energy} energy.`,
            phone: 'You doomscrolled late into the night. Mood improved, tomorrow will be rough.',
            phone_social: 'A long chat with friends made you feel less alone.',
            overtime: (money) => `You worked overtime and earned $${money}.`,
            overtimeProgress: (p) => `Task progress +${p}%.`,
            overtimeComplete: 'Task completed.',
            entertainment: (cost) => `You went out to decompress. -$${cost}.`,
            prepareMeal: 'You prepped tomorrow\'s lunch box. Cheaper and healthier.',
            grocery: 'You stocked a week of ingredients at the store.'
        }
    },

    ui_static: {
        finance: {
            provision: 'Stock',
            wait: 'days',
            not_prepared: 'Not prepared'
        },
        status_page: {
            commute: 'Commute',
            survival: 'Survival Stats',
            dev_tools: 'Developer Tools',
            dev_check: 'Event Consistency Check',
            dev_desc: 'Analyze whether event outcomes match their descriptions',
            job_title: 'Current Role',
            job_income: 'Monthly Income',
            work_efficiency: 'Work Efficiency',
            social_val: 'Social',
            unemployed_days: 'Days Unemployed',
            pto_days: 'Paid Sick Leave',
            recovery_effect: 'Recovery Effect',
            commute_type: 'Commute Type',
            weekly_gas: 'Weekly Fuel',
            monthly_car_ins: 'Monthly Car Insurance'
        },
        insurance_page: {
            deductible_hint: 'Before deductible is met, medical costs are fully out-of-pocket.',
            pending_change: 'Will switch next month: ',
            adjust_plan_btn: 'Adjust Plan',
            status_label: 'Status',
            buy_ins_btn: 'Buy Insurance'
        },
        assets_page: {
            news_loading: 'Loading...'
        },
        finance_detail: {
            title: 'Finance Details',
            cash_title: 'Cash Assets',
            noInvestments: 'No holdings',
            noDebt: 'No debt',
            repay_placeholder: 'Enter repayment amount'
        },
        bill_detail: {
            title: 'Bill Details',
            total_label: 'Total:',
            rent: 'Rent',
            insurance: 'Insurance',
            utility: 'Utilities',
            due_in: (days) => `Due in ${days} day(s)`,
            due_today: '(Due today!)'
        },
        event: {
            advance_btn: 'Advance Time'
        },
        ending_screen: {
            title: 'Game Over',
            subtitle: 'You were terminated by the system',
            default_message: 'In Country M, only one layoff, one major illness, or one accident stands between the middle class and homelessness.',
            restart_btn: 'Try Again',
            continue_btn: 'Continue Game',
        },
        ending_stats: {
            days: 'Days Survived',
            money: 'Final Savings',
            housing: 'Final Housing',
            job: 'Job Status',
            energy: 'Final Energy',
            debt: 'Final Debt',
        }
    },

    ui: {
        toast: {
            copyError: 'Copy failed',
            undoChangeRequest: 'Change request revoked, current plan kept',
            isCurrentPlan: 'This is your current plan',
            isCurrentOption: 'This is your current option',
            changeSubmitted: (name) => `Change submitted: ${name}`,
            changeRevoked: 'Change request revoked',
            nextMonthActive: 'Request submitted. Effective next month.',
            assetLoadError: 'Failed to load asset data',
            tradeInfoError: 'Trade info error',
            gmSaved: 'GM data saved',
            gameResumed: 'You have chosen to return to the cruel world.',
        },
        modal: {
            buyAsset: 'Buy Asset',
            sellAsset: 'Sell Asset',
            dev_editor: 'Edit Attributes',
            message_history: 'Message History'
        },
        insurance: {
            cancelInsurance: 'Cancel Insurance',
            nextMonthCancel: 'Cancel',
            pendingHint: (name) => `Pending: ${name}`,
            revokeChange: '(Revoke)',
            pendingCarPlan: (name) => `Pending Car Plan: ${name}`,
            nextMonthEffective: 'Effective next month',
            coinsuranceHint: 'Coinsurance:'
        },
        save: {
            seedLabel: 'SEED:',
            noSeed: 'N/A',
            copySeedTitle: 'Copy Seed'
        },
        status: {
            energyRecovery: (val) => `Energy Recovery ${val > 0 ? '+' : ''}${val}`,
            mentalBonus: (val) => `Mental ${val > 0 ? '+' : ''}${val}`,
            healthBonus: (val) => `Health ${val > 0 ? '+' : ''}${val}`,
            effectsTitle: 'Effects',
            close: 'Close',
            commuteUses: (fuel, capacity) => `${fuel}/${capacity} uses`,
            perMonthMoney: (amount) => `$${amount}/mo`,
            dayCount: (days) => `${days}d`
        },
        assets: {
            confirmBuy: 'Confirm Buy',
            confirmSell: 'Confirm Sell'
        },
        validation: {
            selectIncident: 'Incident'
        },
        dev_editor: {
            ingredients: 'Ingredients',
            job: 'Job Status',
            save_btn: 'Save Changes'
        }
    },

    events: {
        hospital_stay: {
            descRestDay: '\nToday is a rest day. Focus on recovery.',
            descPtoAvailable: (days) => `\nPTO available: ${days} day(s).`,
            descPtoWarning: '\nWarning: no PTO left. Staying in hospital now reduces salary and raises firing risk.'
        },
        rent_due: {
            choices: {
                moveOut: {
                    text: 'Move to a cheaper room',
                    hint: (newCost, mentalLoss) => `New rent $${newCost}, Mental-${mentalLoss}`
                },
                carDwelling: {
                    text: 'Move into your car now',
                    hint: (mentalLoss) => `Become car-dwelling, Mental-${mentalLoss}`
                },
                homelessNow: {
                    text: 'Leave now and become homeless',
                    hint: (mentalLoss, creditLoss) => `Homeless now, Mental-${mentalLoss}, Credit-${creditLoss}`
                }
            },
            messages: {
                negotiateSuccess: (creditLoss) => `Landlord agreed to a short extension. Credit-${creditLoss}`,
                moveOut: 'You moved into a cheaper shared room.',
                carDwelling: 'You packed overnight and moved into your car.',
                homelessNow: 'You gave up the lease and ended up on the street.'
            }
        },
        hospital_stay_choices: {
            paid_leave: {
                text: 'Follow treatment (Paid Leave)',
                hint: (min, max, e) => `PTO-1 H+${min}-${max} E+${e}`,
                message: (r) => `Recovered H+${r}. Salary unchanged.`
            },
            rest_day: {
                text: 'Follow treatment (Rest Day)',
                hint: (min, max, e) => `No PTO used H+${min}-${max} E+${e}`,
                message: (r) => `Recovered H+${r} on a rest day.`
            },
            unpaid_leave: {
                text: 'Follow treatment (Unpaid Leave)',
                hint: (risk, min, max) => `No PTO left. Fire risk +${risk}%, H+${min}-${max}`,
                message: (r, risk) => `Recovered H+${r}. Fire risk ${risk}%.`,
                report: (pay) => `Hospital unpaid leave: salary -$${pay}`,
                fired: 'Bad news: you were fired for extended absence.',
                fired_no_ins: 'Bad news: you were fired for extended absence. Employer insurance ends tomorrow.'
            },
            out_of_pocket: {
                text: 'Follow treatment (Self-pay)',
                hint: (min, max) => `Use savings, H+${min}-${max}`,
                message: (r) => `Treatment continued. Recovered H+${r}.`
            },
            ama: {
                text: 'Leave Against Medical Advice (AMA)',
                hint: (h, m) => `Health set to ${h}, Mental-${m}`,
                message: 'You signed AMA discharge and left the hospital. Relapse risk remains.'
            }
        },
        day_rest_choices: {
            sleep: {
                text: 'Deep Sleep',
                hint: (e, h) => `E+${e} H+${h}`,
                message: 'You woke up naturally, fully recharged.'
            },
            cook: {
                text: 'Cook at Home',
                hint: (i, h, m) => `-${i} ingredients H+${h} M+${m}`,
                message: 'A proper home-cooked meal helped both body and mind.'
            },
            shop: {
                text: 'Weekly Grocery Run',
                hint: (c, i) => `-$${c}, +${i} ingredients`,
                message: 'You stocked up ingredients for the week.'
            },
            delivery: {
                text: 'Do Delivery Gig',
                hint: (m, e) => `+$${m}, E-${e}`,
                message: (money) => `You traded your rest day for $${money}.`
            },
            walk: {
                text: 'City Walk',
                hint: (c, m, chance, luckyMoney) => `-$${c}, M+${m}, ${chance}% chance to find $${luckyMoney}`,
                message: 'You wandered through the city and relaxed a little.',
                message_lucky: (money) => `Lucky day: you found $${money} while walking.`
            }
        },
        night_choice: {
            title: 'Night Falls',
            description: 'The day is ending. Choose how to spend tonight before tomorrow\'s pressure begins.'
        },
        deep_night_idle: {
            title: 'Late Night',
            description: 'The city quiets down. You try to sleep while reality keeps whispering.',
            choices: {
                continue: { text: 'Continue', hint: 'Proceed to next day' }
            },
            messages: {
                continue: 'The night passes.'
            }
        },
        day_work: {
            title: 'Workday',
            description: 'Another day on the grind. How do you want to handle it?'
        },
        day_rest: {
            title: 'Rest Day',
            description: 'You finally have a day off. How will you use this rare free time?',
            choices: {
                sleep: { text: 'Deep Sleep', hint: (e, h) => `E+${e}, H+${h}` },
                cook: { text: 'Cook at Home', hint: (i, h, m) => `-${i} ingredients, H+${h}, M+${m}` },
                grocery: { text: 'Big Grocery Run', hint: (c, i) => `-$${c}, +${i} ingredients (rest-day discount)` },
                gig: { text: 'Delivery Gig', hint: (m, e) => `+$${m}, E-${e}` },
                walk: { text: 'City Walk', hint: (c, m, chance, luckyMoney) => `-$${c}, M+${m} (${chance}% chance to find $${luckyMoney})` },
                hangout: { text: 'Meet Friends', hint: (c, e, s, m) => `-$${c}, E-${e}, S+${s}, M+${m}` },
                deep_sleep: { text: 'Hibernate', hint: (m) => `Energy to full, max health +1, social -${m}` },
                massage: { text: 'Massage Therapy', hint: (c, h, maxH, e) => `-$${c}, H+${h}, max health +${maxH}, E-${e}` }
            },
            messages: {
                sleep: 'You slept until you woke up naturally. Worth missing lunch.',
                cook: 'You cooked a proper meal. Healthy and calming.',
                grocery: 'You stocked ingredients for the whole week.',
                gig: (money) => `You gave up rest and earned $${money} doing deliveries.`,
                walkLucky: (money) => `Lucky break: you found $${money} while walking.`,
                walk: 'You wandered the city and let your mind breathe.',
                hangout: 'It cost some money, but venting with friends helped a lot.',
                deep_sleep: 'You slept like a rock. Missed a few calls, but your body feels lighter. (Max health +1)',
                massage: 'Painful session, great results. Your body finally feels aligned again. (Max health +3)'
            }
        },
        day_jobless: {
            title: 'Job Hunting Routine',
            description: 'Another unemployed morning. You open job boards and see endless silence.',
            choices: {
                apply: { text: 'Mass Apply', hint: (e, rate, mental) => `E-${e}, ${rate}% interview chance (affected by work efficiency), fail: M-${mental}` },
                relax: { text: 'Scroll to Relax', hint: (m) => `M+${m}` },
                learn: { text: 'Learn New Skills', hint: (e, mental, workGain) => `E-${e}, M-${mental}, work efficiency +${workGain}` },
                medicaid: { text: 'Apply for Medicaid', hint: (limit, energy) => `Requires assets < $${limit} and unemployed, E-${energy}` }
            },
            messages: {
                applySuccess: 'A company replied. You got an interview this afternoon.',
                applyFail: 'Another day, another inbox of silence.',
                relax: 'You scrolled all morning. Mood improved a little.',
                learn: 'You learned something useful. Work efficiency improved.',
                medicaidTooRich: (limit) => `System notice: your assets exceed the poverty threshold ($${limit}). Application denied.`,
                medicaidApplied: (minDays, maxDays) => `Application submitted. Review time is ${minDays}-${maxDays} business days.`
            }
        },
        morning_coffee: {
            title: 'Coffee?',
            description: 'You pass a cafe and the smell of coffee hits hard.',
            choices: {
                buy: { text: 'Buy Coffee', hint: (cost, energy, health) => `-$${cost}, E+${energy}, H-${health}` },
                skip: { text: 'Skip and Save', hint: 'No stat change' }
            },
            messages: {
                buy: 'Caffeine kicks in and wakes you up.',
                skip: (cost) => `You resisted temptation and saved $${cost}.`
            }
        },
        afternoon_interview: {
            title: 'Interview Opportunity',
            description: 'The interview finally came. You take a deep breath.',
            choices: {
                tryHard: {
                    text: 'Go All In',
                    hint: (energy, chance, mentalSuccess, mentalFail) => `E-${energy}, success ${chance}% (affected by work efficiency), success: M+${mentalSuccess}, fail: M-${mentalFail}`,
                    hint_homeless: (energy) => `E-${energy} (homeless status: interviewer rejects immediately)`
                },
                casual: { text: 'Take It Easy', hint: (energy, chance, mental) => `E-${energy}, success ${chance}% (lower than all-in), success: M+${mental}` }
            },
            messages: {
                homelessReject: 'The interviewer looked at your situation and passed.',
                success: 'Offer secured! (Perk: starts with 3 PTO days)',
                fail: 'Interview failed. Keep going.',
                casualSuccess: 'You actually made it. Lucky break.',
                casualFail: 'As expected, it did not work out.'
            }
        },
        afternoon_exercise: {
            title: 'Workout Time',
            description: 'You have some free time this afternoon. Exercise?',
            choices: {
                gym: { text: 'Go to Gym', hint: (energy, mental, health) => `E-${energy}, M+${mental}, H+${health}` },
                walk: { text: 'Take a Walk', hint: (energy, mental) => `E-${energy}, M+${mental}` },
                skip: { text: 'Stay in Bed', hint: 'Save energy' }
            },
            messages: {
                gym: 'Great workout. You feel alive again.',
                walk: 'A walk in the park helped clear your mind.',
                skip: 'You decided to conserve energy.'
            }
        },
        afternoon_gig: {
            title: 'Gig Opportunity',
            description: 'A short-term job pops up in a group chat. Take it?',
            choices: {
                accept: { text: 'Take the Gig', hint: (gain, energy) => `+$${gain}, E-${energy}` },
                decline: { text: 'Decline', hint: 'Save energy' }
            },
            messages: {
                tooTired: (money) => `You were exhausted and only made $${money}.`,
                success: (money) => `Gig done. Earned $${money}.`,
                decline: 'You skipped this one.'
            }
        },
        pip_warning: {
            title: 'PIP Warning',
            description: 'HR email arrives: "Performance Improvement Plan." You have 5 days to prove yourself.',
            choices: {
                accept: { text: 'Accept Challenge', hint: (days, mental) => `Enter ${days}-day review, M-${mental}` },
                quit: { text: 'Job Hop Now', hint: (energy, chance, raisePct, mentalGain, mentalLoss, pipDelta) => `E-${energy}, ${chance}% new-job chance (success: +${raisePct}% salary, M+${mentalGain}; fail: M-${mentalLoss}, PIP+${pipDelta})` }
            },
            messages: {
                start: 'PIP review period begins. Your next few days matter a lot.',
                quitSuccess: (oldIncome, newIncome) => `New job secured! Salary: $${oldIncome} -> $${newIncome}`,
                quitFail: 'No offer yet. You have to face the PIP.'
            }
        },
        pip_result: {
            title: 'PIP Result',
            description: 'The review period is over. HR asks you into a room.',
            choices: {
                enter: { text: 'Walk In', hint: (mentalGain, mentalLoss) => `Hear final result (pass: M+${mentalGain}, fail: M-${mentalLoss}, fail = fired)` }
            },
            messages: {
                passed: 'You passed the PIP. The company keeps you.',
                failed: 'You failed the PIP and got fired.'
            }
        },
        sudden_layoff: {
            title: 'Sudden Layoff',
            description: 'The company announces layoffs. Your name is on the list.',
            choices: {
                accept: { text: 'Accept It', hint: (money, mental) => `+$${money} severance, M-${mental}, laid off` },
                fight: { text: 'Push Back', hint: (energy, mentalSuccess, mentalFail, successMoney, failMoney) => `E-${energy}, success M-${mentalSuccess}, fail M-${mentalFail} (success +$${successMoney}, fail +$${failMoney}; both laid off)` }
            },
            messages: {
                accept: (amount) => `Laid off... at least you got $${amount} severance.`,
                fightSuccess: (amount) => `You negotiated and got $${amount} severance.`,
                fightFail: (amount) => `Negotiation failed. Only $${amount} severance and a lot of stress.`
            }
        },
        intern_badge_decision: {
            title: 'Intern Scapegoat',
            description: 'HR says your layoff is imminent. You remember the intern badge trick.',
            choices: {
                use: { text: 'Blame the Intern', hint: (social) => `S-${social}, keep your job` },
                accept: { text: 'Accept Layoff', hint: 'You do not want to hurt someone else' }
            },
            messages: {
                use: 'The intern took the hit. You keep your job for now.',
                accept: 'You accepted the consequences and left the company.'
            }
        },
        sell_car_emergency: {
            title: 'Emergency Cash: Sell the Car',
            description: 'Your deficit is turning dangerous. A used-car dealer offers cash below your ideal price, but it can buy time.',
            choices: {
                sell: {
                    text: 'Sell Car',
                    hint: (gain, mentalLoss) => `Receive $${gain}, no car commute afterward. If living in car, you become homeless. M-${mentalLoss}`
                },
                keep: {
                    text: 'Keep Car',
                    hint: (loss) => `Financial pressure continues. M-${loss}`
                }
            },
            messages: {
                sell: 'You took the cash and lost the car. Survival got easier today, harder tomorrow.',
                keep: 'You kept the car. Maybe that mobility is worth more than short-term cash.'
            }
        },
        buy_used_car: {
            title: 'Used Car Opportunity',
            description: 'You see a used car for sale roadside. Not pretty, but affordable.',
            choices: {
                deal: {
                    text: 'Buy It',
                    hint: (cost, mentalGain) => `-$${cost}, gain car, M+${mentalGain}`
                },
                ignore: {
                    text: 'Pass',
                    hint: 'Not needed or not affordable'
                }
            },
            messages: {
                deal: 'You have a car again. Not new, but far better than bus chaos.',
                ignore: 'You walked away. This expense is not right for now.'
            }
        },
        car_breakdown: {
            title: 'Car Breakdown',
            description: 'Your car suddenly breaks down on the way to work.',
            choices: {
                repairNow: {
                    text: 'Repair Immediately',
                    hintFull: (cost, mental) => `-$${cost} (full-coverage deductible), M-${mental}`,
                    hintPartial: (cost, mental) => `-$${cost} (after partial coverage), M-${mental}`,
                    hintOther: (cost, mental) => `-$${cost} (out of pocket), M-${mental}`
                },
                creditRepair: {
                    text: 'Repair on Credit Card',
                    hint: (cost, credit, mental) => `-$${cost}, Credit-${credit}, M-${mental}`
                },
                skip: {
                    text: 'Delay Repair',
                    hint: (mental) => `Car remains broken, future drive commute costs extra and may be late, M-${mental}`
                }
            },
            messages: {
                fullCoverage: 'Good thing you had full coverage. Insurance paid most of it.',
                partialCoverage: 'Liability coverage helped a bit, but you still paid a lot.',
                noFullCoverage: 'Without proper coverage, the repair bill hurts badly.',
                creditRepair: 'You had to rely on credit. Debt pressure rises.',
                skipRepair: 'You leave the car unrepaired for now. Future drives are riskier and costlier.'
            }
        },
        burglary: {
            title: 'Burglary',
            description: 'You get home and find signs of a break-in. The place is trashed.',
            choices: {
                report: {
                    text: 'Report to Police and File Claim',
                    hintInsured: (cost, mental) => `-$${cost} deductible, M-${mental}`,
                    hintUninsured: (loss, mental) => `-$${loss} loss, M-${mental}`
                }
            },
            messages: {
                insured: (deductible) => `Insurance covered most losses. You paid deductible $${deductible}.`,
                uninsured: (loss) => `No renters insurance. Total loss: $${loss}.`
            }
        },
        apartment_fire: {
            title: 'Apartment Fire',
            description: 'A midnight fire alarm erupts. Flames spread through the building.',
            choices: {
                escape: {
                    text: 'Evacuate and Assess Damage',
                    hintInsured: (cost, mental) => `-$${cost} deductible, M-${mental}`,
                    hintUninsured: (loss, mental) => `-$${loss} loss, M-${mental}`
                }
            },
            messages: {
                insured: (deductible) => `Heavy damage, but renters insurance helped. Deductible paid: $${deductible}.`,
                uninsured: (loss) => `No renters insurance. Fire damage cost you $${loss}.`
            }
        },
        apartment_accident: {
            title: 'Apartment Accident',
            description: 'An apartment accident damaged some of your belongings.',
            choices: {
                repair: {
                    text: 'Handle the Damage',
                    hintInsured: (deductible, mental) => `-$${deductible} deductible, M-${mental}`,
                    hintUninsured: (cost, mental) => `-$${cost} repair, M-${mental}`
                }
            },
            messages: {
                insured: (deductible) => `Claim approved. You paid deductible $${deductible}.`,
                uninsured: (cost) => `No coverage. You paid $${cost} yourself.`
            }
        },
        homeless_night: {
            title: 'Nowhere to Stay',
            description: 'Another night without shelter. You need somewhere to sleep.',
            choices: {
                street: { text: 'Sleep on the Street', hint: (mental, health, recovery) => `M-${mental}, H-${health}, tomorrow energy ${recovery}` },
                shelter: { text: 'Try a Shelter', hint: (chance, successMental, failMental, failHealth, successRecovery, failRecovery) => `${chance}% bed chance; success M-${successMental}, tomorrow energy ${successRecovery}; fail M-${failMental}, H-${failHealth}, tomorrow energy ${failRecovery}` }
            },
            messages: {
                street: 'You survive another difficult night on the street.',
                shelterSuccess: 'You got a shelter bed and slept decently.',
                shelterFail: 'No space in the shelter. Back to the street.'
            }
        },
        car_night: {
            title: 'Night in the Car',
            description: 'You recline the seat and try to sleep in your car.',
            choices: {
                hide: { text: 'Park Somewhere Hidden', hint: (mental, recovery) => `M-${mental}, tomorrow energy ${recovery}` },
                parkClose: { text: 'Park Nearby', hint: (kickMental, safeMental, kickRecovery, safeRecovery) => `May get kicked out; safe: M-${safeMental}, tomorrow energy ${safeRecovery}; kicked out: M-${kickMental}, tomorrow energy ${kickRecovery}` }
            },
            messages: {
                safe: 'You found a relatively safe parking lot for the night.',
                kickedOut: 'Police knocked and forced you to move at midnight.',
                safeNight: 'You make it through the night safely.'
            }
        },
        hot_weather: {
            title: 'Heat Wave Night',
            description: 'Tonight is brutally hot. Sleeping is difficult in this heat.',
            choices: {
                ac: { text: 'Use AC', hint: (mental, bill, recovery) => `Cool sleep, M+${mental}, utility +$${bill}, tomorrow energy ${recovery}` },
                fan: { text: 'Use Fan Only', hint: (mental, bill, recovery) => `M-${mental}, utility +$${bill}, tomorrow energy ${recovery}` },
                none: { text: 'Use Nothing', hint: (mental, health, recovery) => `M-${mental}, H-${health}, tomorrow energy ${recovery}` }
            },
            messages: {
                ac: (bill) => `AC made the night bearable, but your next utility bill increases by $${bill}.`,
                fan: 'Hot air from the fan keeps you tossing all night.',
                none: 'The heat ruins your sleep and leaves you drained the next day.'
            }
        },
        cold_weather: {
            title: 'Cold Snap',
            description: (temp) => `Temperature drops to ${temp}degC tonight. Without action, you may get sick.`,
            choices: {
                heatHigh: { text: 'Turn Heat to Max', hint: (money, energy) => `-$${money}, E-${energy}` },
                wearMore: { text: 'Layer Up and Endure', hint: (money, energy) => (money ? `-$${money}, E-${energy}` : `E-${energy}`) },
                gym: { text: 'Stay at Gym Overnight', hint: (money, energy, health) => `-$${money}, E-${energy}, H+${health}` }
            },
            messages: {
                heatHigh: 'Expensive, but warm and restful.',
                wearMore: 'You still feel cold under heavy blankets.',
                gym: 'You stayed warm by working out and grabbing a shower at the gym.'
            }
        },
        insomnia: {
            title: 'Insomnia Night',
            description: 'You keep turning over, mind racing with bills and work pressure.',
            choices: {
                pills: { text: 'Take Sleeping Pills', hint: (cost, health, recovery) => `-$${cost}, H-${health}, guaranteed sleep, tomorrow energy ${recovery}` },
                phone: { text: 'Scroll Phone to Distract', hint: (mental, recovery) => `M+${mental}, tomorrow energy ${recovery}` },
                meditate: { text: 'Try Meditation', hint: (chance, mental, successRecovery, failRecovery) => `${chance}% success, M+${mental}, success tomorrow energy ${successRecovery}, fail tomorrow energy ${failRecovery}` }
            },
            messages: {
                pills: 'The medicine knocks you out, but it is rough on your body.',
                phone: 'You scroll until very late before drifting off.',
                meditateSuccess: 'Meditation calms you down and you fall asleep.',
                meditateFail: 'You relax a bit, but still stay awake for too long.'
            }
        },
        neighbor_noise: {
            title: 'Neighbor Noise',
            description: 'Loud music and party noise blast through the wall.',
            choices: {
                complain: { text: 'Knock and Complain', hint: (successChance, conflictLoss, successRecovery, failRecovery) => `${successChance}% success; fail M-${conflictLoss}; success tomorrow energy ${successRecovery}, fail ${failRecovery}` },
                earplugs: { text: 'Use Earplugs', hint: (recovery) => `tomorrow energy ${recovery}` },
                police: { text: 'Call Police', hint: (successChance, social, recovery) => `${successChance}% success, S-${social}, tomorrow energy ${recovery}` }
            },
            messages: {
                complainSuccess: 'Your neighbor apologizes and turns the volume down.',
                complainFail: 'The confrontation goes badly and your mood gets worse.',
                earplugs: 'Earplugs help a little, but sleep is still fragmented.',
                police: 'The noise stops after police show up, but neighbor relations worsen.'
            }
        },
        boss_late_message: {
            title: 'Late-Night Message from Boss',
            description: 'Your phone buzzes: "Meeting at 8 AM tomorrow."',
            choices: {
                reply: { text: 'Reply Immediately', hint: (social, mental, recovery) => `S+${social}, M-${mental}, tomorrow energy ${recovery}` },
                ignore: { text: 'Pretend You Did Not See It', hint: 'Sleep normally, no energy change tomorrow' },
                prepare: { text: 'Stay Up to Prepare', hint: (social, recovery) => `S+${social}, tomorrow energy ${recovery}` }
            },
            messages: {
                reply: 'After replying, anxiety keeps you awake for hours.',
                ignore: 'Work can wait until morning. You choose rest.',
                prepare: 'You prepare materials all night, but tomorrow will be rough.'
            }
        },
        late_night_craving: {
            title: 'Late-Night Craving',
            description: 'Your stomach growls. You really want a midnight snack.',
            choices: {
                order: { text: 'Order Delivery', hint: (cost, mental, health, recovery) => `-$${cost}, M+${mental}, H-${health}, tomorrow energy ${recovery}` },
                cook: { text: 'Cook Something Simple', hint: (ingredients, health, recovery) => `-${ingredients} ingredients, H+${health}, ${recovery === 0 ? 'no energy change tomorrow' : `tomorrow energy ${recovery}`}` },
                water: { text: 'Drink Water and Endure', hint: (mental, recovery) => `M-${mental}, ${recovery === 0 ? 'no energy change tomorrow' : `tomorrow energy ${recovery}`}` }
            },
            messages: {
                order: 'You go to bed full and satisfied.',
                cook: 'You made a simple meal: healthier and cheaper.',
                water: 'You sleep hungry and dream of food.'
            }
        },
        nightmare: {
            title: 'Nightmare Wake-Up',
            description: 'You jolt awake from a nightmare, heart racing and drenched in sweat.',
            choices: {
                breathe: { text: 'Breathe and Calm Down', hint: (mental, successRecovery, failRecovery) => `Fail M-${mental}; success tomorrow energy ${successRecovery}, fail ${failRecovery}` },
                getUp: { text: 'Get Up and Do Something', hint: (mental, recovery) => `M+${mental}, tomorrow energy ${recovery}` }
            },
            messages: {
                sleepBad: 'You calm down somewhat, but sleep stays shallow.',
                sleepTerrible: 'The nightmare lingers and you barely sleep.',
                distract: 'You tidy up to distract yourself, then eventually fall asleep again.'
            }
        },
        loneliness: {
            title: 'A Wave of Loneliness',
            description: 'You realize it has been a long time since you talked to friends.',
            choices: {
                contact: { text: 'Reach Out to an Old Friend', hint: (cost, social, mental, recovery) => `-$${cost}, S+${social}, M+${mental}, tomorrow energy ${recovery > 0 ? `+${recovery}` : recovery}` },
                socialMedia: { text: 'Scroll Social Media', hint: (social, mental, recovery) => `S+${social}, M-${mental}, tomorrow energy ${recovery > 0 ? `+${recovery}` : recovery}` },
                bear: { text: 'Endure It Alone', hint: (mental) => `M-${mental}` }
            },
            messages: {
                contact: 'A long chat with an old friend helps you feel less alone.',
                socialMedia: 'You scroll all night and feel even more empty.',
                bear: 'You carry the loneliness alone in silence.'
            }
        },
        feeling_under_weather: {
            title: 'Feeling Under the Weather',
            description: 'Your throat hurts and your head feels heavy. Might be a cold.',
            choices: {
                clinic: { text: 'Minute Clinic', hint: (cost, success, fail, insurancePays, baseCost) => `-$${cost} (base $${baseCost}, insurance paid $${insurancePays}), H+${success} or H-${fail}` },
                otc: { text: 'Take OTC Medicine', hint: (cost, diff) => `-$${cost}, H+${diff} or H-${diff}` },
                urgentCare: { text: 'Urgent Care', hint: (cost) => `-$${cost}` },
                ignore: { text: 'Push Through', hint: (health, mental) => `H-${health}, M-${mental}` }
            },
            messages: {
                clinicFail: 'The clinic says it is minor, but you feel worse.',
                clinicSuccess: 'You got treatment and feel better.',
                otcFail: 'The medicine does not seem to help.',
                otcSuccess: 'OTC medicine works. You feel a bit better.',
                ignore: 'You decide to tough it out and hope tomorrow is better.'
            }
        },
        worsening_symptoms: {
            title: 'Symptoms Worsen',
            description: 'Your condition gets worse: fever, coughing, and no real recovery.',
            choices: {
                urgentCare: { text: 'Urgent Care', hint: (cost, health, insurancePays, baseCost) => `Expected -$${cost} (base $${baseCost}, insurance paid $${insurancePays}), H+${health}` },
                pcp: { text: 'Book PCP Appointment', hint: (wait) => `Estimated wait: ${wait} days` },
                er: { text: 'Go to ER', hint: (healthDelta, cost, insurancePays, baseCost) => `Health ${healthDelta}, expected -$${cost} (base $${baseCost}, insurance paid $${insurancePays})` }
            },
            messages: {
                urgentCareTreated: (cost) => `Treatment completed. Bill: $${cost}.`,
                urgentCareOutOfNetwork: ' Warning: out-of-network clinic, insurance barely covered it.',
                urgentCareResult: ' Fever has gone down.',
                pcpBooked: (days) => `Appointment booked. Earliest slot is in ${days} days.`,
                erTreated: (cost) => `You spent the night in ER. Cost: $${cost}.`,
                erDenied: ' Warning: insurance claim denied.'
            }
        },
        medical_emergency: {
            title: 'Medical Emergency',
            description: 'You collapse and can barely breathe. ER is immediately needed.',
            choices: {
                ambulance: { text: 'Call Ambulance to ER', hint: (healthDelta, mental, cost, insurancePays, baseCost) => `Health ${healthDelta}, M-${mental}, expected -$${cost} (base $${baseCost}, insurance paid $${insurancePays})` },
                uber: { text: 'Take Uber to ER', hint: (cost, deathChance, healthDelta, insurancePays, baseCost) => `Expected -$${cost} (base $${baseCost}, insurance paid $${insurancePays}), ${deathChance}% death risk en route, health ${healthDelta}` },
                giveUp: { text: 'Give Up', hint: (healthLoss) => `H-${healthLoss}, game over` }
            },
            messages: {
                ambulanceSaved: (bill, days) => `You survived, but need hospitalization. ER bill: $${bill}. Estimated hospital stay: ${days} day(s).`,
                uberDied: 'You lose consciousness in the back seat... It is over.',
                uberSaved: (bill, days) => `You barely make it. ER bill: $${bill}. Doctor orders immediate hospitalization for ${days} day(s).`,
                died: 'You close your eyes...',
                surgeryCancelled: '\nDue to emergency surgery, your previously pending elective surgery approval is canceled.'
            }
        },
        emergency_oon: {
            title: 'Emergency Transport Decision',
            description: 'Sudden severe chest pain. Paramedics ask which hospital to go to.',
            choices: {
                nearest: { text: 'Nearest Hospital', hint: (chance, health, mental, oonCost, inCost, insurancePays, baseCost) => `${chance}% out-of-network (pay -$${oonCost}, M-${mental}); H+${health}; in-network pay -$${inCost} (base $${baseCost}, insurance paid $${insurancePays})` },
                inNetwork: { text: 'Find In-Network First', hint: (health, mental, cost, insurancePays, baseCost) => `H-${health}, M-${mental}, pay -$${cost} (base $${baseCost}, insurance paid $${insurancePays})` }
            },
            messages: {
                oon: (cost) => `You survive, but it is out-of-network. You pay $${cost}.`,
                network: (cost) => `Good luck: in-network hospital. You pay $${cost}.`,
                delay: (cost) => `Delay worsened your condition. You pay $${cost}.`
            }
        },
        surgery_required: {
            title: 'Surgery Required',
            description: 'Doctor says you need surgery soon. Not immediate ER, but urgent.',
            choices: {
                urgent: { text: 'Operate Immediately', hint: (cost, health, mental, insurancePays, baseCost) => `-$${cost} (base $${baseCost}, insurance paid $${insurancePays}), H+${health}, M-${mental}` },
                wait: { text: 'Wait for Approval', hint: (health, mental, minDays, maxDays) => `H-${health}, M-${mental}, wait ${minDays}-${maxDays} days` },
                fight: { text: 'File Urgent Appeal', hint: (mental, health, chance, successCost, failCost, successInsurancePays, successBaseCost) => `M-${mental}, H-${health}, ${chance}% success (success pay $${successCost} [base $${successBaseCost}, insurance paid $${successInsurancePays}], fail pay $${failCost})` }
            },
            messages: {
                denied: (cost) => `No prior authorization, insurance denied. You pay $${cost}.`,
                wait: (days) => `Approval waiting period started (about ${days} days). Health declines during wait.`,
                fightSuccess: (cost) => `Appeal succeeded. Emergency approval granted. You pay $${cost} after coverage.`,
                fightFail: (cost) => `Appeal failed. Insurance still denies it. You pay $${cost}.`
            }
        },
        surgery_approval: {
            title: 'Surgery Approval Result',
            description: 'Hospital notifies you that the surgery approval decision is ready.',
            choices: {
                check: { text: 'Check Result', hint: (chance, successCost, successHealth, failHealth, failMental, successInsurancePays, successBaseCost) => `Approval chance ${chance}% (approved: pay $${successCost} [base $${successBaseCost}, insurance paid $${successInsurancePays}], H+${successHealth}; denied: H+${failHealth}, M-${failMental})` }
            },
            messages: {
                approved: (cost, health) => `Approved. Surgery arranged. Pay $${cost}, H+${health}.`,
                denied: (cost, health, mental) => `Denied. Self-pay surgery required. Pay $${cost}, H+${health}, M-${mental}.`
            }
        },
        fastfood_warning: {
            title: 'Fast Food Warning',
            description: (days) => `You have eaten fast food for ${days} consecutive days. Your body is protesting.`,
            choices: {
                healthy: { text: 'Improve Diet Now', hint: (cost, health, ingredients) => `-$${cost} healthy groceries, H+${health}, ingredients +${ingredients}` },
                ignore: { text: 'Keep Coping', hint: (health, mental) => `H-${health}, M-${mental}` }
            },
            messages: {
                healthy: 'You buy healthier ingredients and start taking care of yourself.',
                ignore: 'Your body keeps getting worse, but you feel stuck.'
            }
        },
        medical_debt_collection: {
            title: 'Debt Collection Call',
            description: (amount) => `Collectors are calling about your medical debt: $${amount}.`,
            choices: {
                pay: { text: 'Pay in Full', hint: (debt, credit, mental) => `Pay $${debt}, Credit+${credit}, M+${mental}` },
                installment: { text: 'Negotiate Installments', hint: (monthly, credit, mental) => `Monthly $${monthly}, Credit-${credit}, M-${mental}` },
                refuse: { text: 'Ignore Calls', hint: (credit, mental) => `Credit-${credit}, M-${mental}` }
            },
            messages: {
                paid: (amount) => `Medical debt paid: $${amount}.`,
                installment: (amount) => `Installment plan started. Monthly payment: $${amount}.`,
                refused: 'Avoiding collectors does not solve it. Credit score drops sharply.'
            }
        },
        credit_collapse: {
            title: 'Credit Collapse',
            description: 'Your credit score falls below 500. Cards are frozen and housing risk rises.',
            choices: {
                accept: {
                    text: 'Accept Reality',
                    hint: 'Credit cards are frozen; some options become unavailable.'
                },
                fix: {
                    text: 'Try to Repair Credit',
                    hint: (cost, creditGain, energyCost, mentalLoss) => `-$${cost}, Credit+${creditGain}, E-${energyCost}, M-${mentalLoss}`
                }
            },
            messages: {
                evicted: 'Credit collapse triggers eviction risk. You are forced out and end up in your car.',
                frozen: 'Credit collapse: your cards are frozen and daily life becomes harder.',
                fixed: (cost) => `You spend $${cost} on repair efforts and stabilize your credit a bit.`
            }
        },
        medical_debt_installment: {
            title: 'Medical Debt Installment Due',
            description: 'This month\'s medical debt installment is due.',
            choices: {
                pay: { text: (amount) => `Pay $${amount}`, hint: (amount, debt) => `-$${amount}, remaining debt $${debt}` },
                cantPay: { text: 'Cannot Pay', hint: (score, mental) => `Credit-${score}, M-${mental}, debt + interest` }
            },
            messages: {
                paidFinished: 'Congratulations! Medical debt fully paid.',
                paid: (amount, debt) => `Paid $${amount}, remaining debt $${debt}.`,
                cantPay: (debt) => `Unable to pay this installment. Debt increased to $${debt}.`
            }
        },
        utility_bill_due: {
            title: 'Utility Bill',
            description: (cost) => `This month\'s utility bill arrives: $${cost}`,
            choices: {
                pay: { text: 'Pay Now', hint: (cost) => `-$${cost}` },
                delay: { text: 'Delay Payment', hint: (score) => `Credit-${score}` }
            },
            messages: {
                paid: (cost) => `Paid utility bill: $${cost}.`,
                delayed: 'Payment delayed one week. Credit score affected.'
            }
        },
        phone_bill_due: {
            title: 'Phone Bill',
            description: (cost) => `Carrier notice: monthly phone bill $${cost} is due.`,
            choices: {
                pay: { text: 'Pay Bill', hint: (cost) => `-$${cost}` },
                delay: { text: 'Do Not Pay Yet', hint: 'Service will be suspended' }
            },
            messages: {
                paid: 'Phone bill paid.',
                delayed: 'Service suspended immediately. No calls available.'
            }
        },
        car_insurance_due: {
            title: 'Car Insurance Bill',
            description: (cost) => `Insurance invoice: monthly premium $${cost}`,
            choices: {
                pay: { text: 'Pay Premium', hint: (cost) => `-$${cost}` },
                cancel: { text: 'Cancel Insurance', hint: 'Save money but drive illegally' }
            },
            messages: {
                paid: (cost) => `Car insurance paid: $${cost}.`,
                cancelled: (cost) => `Insurance canceled. Saved $${cost}, but driving is now illegal.`
            }
        },
        unemployment_benefit: {
            title: 'Unemployment Benefits',
            description: (days) => `You have been unemployed for ${days} days. You can apply for unemployment benefits.`,
            choices: {
                apply: { text: 'Apply', hint: (pay, weeks) => `Receive $${pay}/week for ${weeks} weeks` },
                decline: { text: 'Decline', hint: 'Keep pride, keep pressure' }
            },
            messages: {
                approved: (amount) => `Application approved. You will receive $${amount} per week.`,
                declined: 'You choose not to apply, but pressure increases.'
            }
        },
        unemployment_payment: {
            title: 'Benefit Payment Arrived',
            description: 'This week\'s unemployment benefit has been issued.',
            choices: {
                collect: { text: (amount) => `Collect $${amount}`, hint: (weeks) => `${weeks} week(s) remaining` }
            },
            messages: {
                lastPayment: (amount) => `Collected $${amount}. This is your last benefit payment.`,
                payment: (amount, weeks) => `Collected $${amount}. ${weeks} week(s) remaining.`
            }
        },
        team_lunch: {
            title: 'Team Lunch',
            description: 'Colleagues invite you to a new nearby restaurant. Good chance to build relationships.',
            choices: {
                join: { text: 'Join Lunch', hint: (cost, social, eff) => `-$${cost}, S+${social}, work efficiency +${eff}` },
                brown_bag: { text: 'Bring Your Own Lunch', hint: (ing, energy, social) => `-${ing} ingredients, E+${energy}, S-${social}` }
            },
            messages: {
                join: 'Great conversation and useful company gossip.',
                brown_bag: 'You save money eating at your desk, but feel less included.'
            }
        },
        after_work_drinks: {
            title: 'After-Work Drinks',
            description: 'Core team members and your boss are going to a bar after work.',
            choices: {
                network: { text: 'Network', hint: (cost, energy) => `-$${cost}, E-${energy}. Success depends on social and work stats.` },
                go_home: { text: 'Go Home Early', hint: (energy, social) => `E+${energy}, S-${social}` }
            },
            messages: {
                success: (eff, mental, social) => `You left a strong impression. (Work+${eff}, M+${mental}, S+${social})`,
                fail: (mental, social) => `You overdid it and said awkward things. (M-${mental}, S-${social})`,
                go_home: 'You skip the gathering and rest well, but feel somewhat sidelined.'
            }
        },
        industry_mixer: {
            title: 'Industry Mixer',
            description: 'A local professional networking event is happening tonight.',
            choices: {
                network: { text: 'Show Professional Skills', hint: (cost, energy) => `-$${cost}, E-${energy}. Success depends on work efficiency.` },
                skip: { text: 'Skip It', hint: 'Save money first' }
            },
            messages: {
                success: (social, mental) => `You made solid industry connections. (S+${social}, M+${mental})`,
                fail: (mental) => `You stand around all night and feel invisible. (M-${mental})`,
                skip: 'You decide not to attend.'
            }
        },
        alumni_reunion: {
            title: 'Alumni Reunion',
            description: 'Your university alumni group sends an invitation to the annual reunion dinner.',
            choices: {
                attend: { text: 'Attend in Style', hint: (cost) => `-$${cost}. Success depends on social value.` },
                ignore: { text: 'Ignore It', hint: (mental) => `Mental ${mental}` }
            },
            messages: {
                success: (mental, social) => `You are the center of attention tonight. (M+${mental}, S+${social})`,
                fail: (mental, social) => `Others discuss huge salaries and IPOs; you feel out of place. (M-${mental}, S-${social})`,
                ignore: 'You throw away the invitation and move on.'
            }
        },
        daily_actions: {
            buy_coffee: { text: 'Buy Coffee', hint: (cost, energy) => `-$${cost}, E+${energy}`, message: 'You feel more awake after coffee.' },
            take_walk: { text: 'Take a Short Walk', hint: (energy, mental, health) => `E-${energy}, M+${mental}, H+${health}`, message: 'A quick walk clears your head.' },
            gossip: { text: 'Office Gossip', hint: (energy, social) => `E-${energy}, S+${social}`, message: 'You hear useful company rumors.' },
            short_nap: { text: 'Power Nap', hint: (energy) => `E+${energy}`, message: 'A short desk nap restores you.' },
            teamwork: { text: 'Collaborate with Colleague', hint: (energy, social, work) => `E-${energy}, S+${social}, work efficiency +${work}`, message: 'You complete a task together smoothly.' },
            none: { text: 'Stay Focused', hint: 'No extra action' }
        },
        work_incidents: {
            urgent_meeting: {
                title: 'Urgent Added Meeting',
                choices: {
                    attend: { text: 'Attend and Perform', hint: (energy, social, workGain) => `E-${energy}, S+${social}, work efficiency +${workGain}` },
                    ignore: { text: 'Stay Silent', hint: (energy, workLoss) => `E-${energy}, work efficiency -${workLoss}` }
                },
                messages: {
                    attend: 'You contribute practical insights during the meeting.',
                    attendHighSocial: 'You contribute practical insights and receive broad praise!',
                    ignore: 'You drift through the meeting with no impact.'
                }
            },
            colleague_help: {
                title: 'Colleague Asks for Help',
                choices: {
                    help: { text: 'Help Out', hint: (energy, social) => `E-${energy || 10}, S+${social || 10}` },
                    decline: { text: 'Politely Decline', hint: (mental, socialLoss, workLoss) => `M+${mental || 3}, S-${socialLoss}, work efficiency -${workLoss}` }
                },
                messages: {
                    help: 'You solve a major issue for your colleague and gain goodwill.',
                    decline: 'You protect your energy and boundaries.'
                }
            },
            overtime_request: {
                title: 'Urgent Request Dropped In',
                choices: {
                    accept: { text: 'Commit to Finish', hint: (energy, workGain) => `E-${energy}, work efficiency +${workGain}` },
                    refuse: { text: 'Leave It for Tomorrow', hint: (social, workLoss) => `S-${social || 5}, work efficiency -${workLoss}` }
                },
                messages: {
                    accept: 'You push through pressure and improve output.',
                    refuse: 'You keep your evening, but leadership is not happy.'
                }
            },
            system_crash: {
                title: 'System Crash',
                choices: {
                    rest: { text: 'Take a Break', hint: (energy) => `E+${energy}` },
                    help: { text: 'Help Troubleshoot', hint: (energy, social) => `E-${energy}, S+${social}` }
                },
                messages: {
                    rest: 'Rare paid downtime.',
                    help: 'You show initiative under pressure.'
                }
            },
            client_meeting: {
                title: 'Client Meeting',
                choices: {
                    prepare: { text: 'Prepare Thoroughly', hint: (energy, social) => `E-${energy}, S+${social}` },
                    wing_it: { text: 'Wing It', hint: (mental, social) => `M+${mental}, may lose S-${social}` }
                },
                messages: {
                    prepare: 'Your performance is strong and the client is satisfied.',
                    prepareHighSocial: 'You perform exceptionally; both client and boss notice.',
                    wing_it_bad: 'The meeting underperforms and the client is unhappy.',
                    wing_it_ok: 'You manage to improvise your way through.'
                }
            },
            office_drama: {
                title: 'Office Drama',
                choices: {
                    listen: { text: 'Listen In', hint: (mental, energy, social) => `M+${mental}, E-${energy}, S+${social}` },
                    avoid: { text: 'Avoid It', hint: (health, social) => `H+${health}, S-${social}` }
                },
                messages: {
                    listen: 'You pick up juicy details and feel entertained.',
                    avoid: 'You stay focused and avoid office politics.'
                }
            },
            presentation: {
                title: 'Department Presentation',
                choices: {
                    lead: { text: 'Lead Presentation', hint: (energy, social, workGain) => `E-${energy}, S+${social}, work efficiency +${workGain}` },
                    support: { text: 'Support Teammate', hint: (energy, social, workGain) => `E-${energy}, S+${social}, work efficiency +${workGain}` }
                },
                messages: {
                    lead: 'Leadership recognizes your presentation quality.',
                    leadHighSocial: 'Leadership recognizes your presentation and coworkers applaud.',
                    support: 'You support the team effectively and keep momentum high.'
                }
            }
        },
        daily_work: {
            description: {
                default: 'Another day of work. How do you want to approach it?',
                commute_prefix: 'Commute status: ',
                commute_suffix: '\n\nHow will you handle today\'s work?'
            },
            focus_work: {
                text: 'Focus on Work',
                hint_pip: (energy, progress, pipBonus) => `E-${energy}, progress +${progress}%, PIP +${pipBonus}`,
                hint_normal: (energy, progress) => `E-${energy}, progress +${progress}%`,
                messages: {
                    complete: (name) => `Task "${name}" completed. New assignment generated.`,
                    progress: (gain, current) => `Task progress +${gain}%, now ${current}%.`,
                    success_pto: 'You stay fully focused and complete today\'s work. +1 PTO day.',
                    success: 'You stay fully focused and complete today\'s work.',
                    fail: 'You worked hard, but progress fell short of expectations.'
                }
            },
            slack_off: {
                text: 'Slack Off',
                hint_pip: (energy, mental, pipPenalty, catchChance) => `E-${energy}, M+${mental}, PIP-${pipPenalty}, ${catchChance}% caught chance`,
                hint_normal: (energy, mental, catchChance) => `E-${energy}, M+${mental}, ${catchChance}% caught chance`,
                messages: {
                    main_pip_critical: (pipPenalty, days) => `Caught slacking! PIP-${pipPenalty}, situation critical! (${days} day(s) left)`,
                    main_pip_lucky: (pipPenalty, days) => `Not caught this time, but PIP-${pipPenalty}. (${days} day(s) left)`,
                    caught_warning: 'You were caught slacking and got warned.',
                    success_pto: (mental) => `Successful slacking. M+${mental}. +1 PTO day.`,
                    success: (mental) => `Successful slacking. M+${mental}.`
                }
            }
        },
        common: {
            accept: 'Accept',
            decline: 'Decline',
            continue: 'Continue',
            skip: 'Skip',
            tryAgain: 'Try Again',
            goHome: 'Go Home',
            goToWork: 'Go To Work',
            takeRest: 'Take Rest',
            seekHelp: 'Seek Help'
        },
        night_routine: {
            title: 'Night Routine',
            description: 'Work is done. The night is your time now.',
            choices: {
                sleep: { text: 'Sleep Well', hint: (mental) => `Recover energy, M+${mental}` },
                phone: { text: 'Stay Up on Phone', hint: (mental, energyPenalty) => `M+${mental}, tomorrow E-${energyPenalty}` },
                overtime: { text: 'Overtime Work', hint: (money, energy, mental, progress) => `+$${money}, E-${energy}, M-${mental}, progress +${progress}%` },
                entertainment: { text: 'Go Out and Relax', hint: (cost, mental, energyPenalty) => `-$${cost}, M+${mental}, tomorrow E-${energyPenalty}` },
                prepareMeal: { text: 'Prep Tomorrow\'s Lunch', hint: (ingredients, energy) => `-${ingredients} ingredients, E-${energy}, lunch ready tomorrow` },
                grocery: { text: 'Buy Weekly Ingredients', hint: (cost, ingredients, energy) => `-$${cost}, +${ingredients} ingredients, E-${energy}` }
            },
            messages: {
                sleep: (recovery) => `You slept well. Tomorrow you recover ${recovery} energy.`,
                phone: 'You scroll late into the night. Mood improves, tomorrow suffers.',
                overtime: (money, bonus) => `You worked late and earned $${money}, but burned out${bonus}`,
                overtimeProgress: (progress, progressGain) => `, progress +${progressGain}% (now ${progress}%)`,
                overtimeComplete: ' Task complete!',
                entertainment: (cost) => `Late-night outing costs $${cost}, but helps your mood.`,
                prepareMeal: 'You prepared tomorrow\'s lunch: cheaper and healthier.',
                grocery: 'You stocked a full week of ingredients.'
            }
        },
        mysterious_trader: {
            title: 'Mysterious Trader',
            description: 'A trench-coated stranger offers to swap your relic for something else.',
            choices: {
                swap: {
                    text: 'Swap Artifact',
                    hint: 'Get one random new artifact and lose your current one.',
                    message: (name) => `Trade complete. You obtained: ${name}.`,
                    error: 'He is out of stock...'
                },
                refuse: {
                    text: 'Refuse',
                    hint: 'Keep current loadout',
                    message: 'You walk away.'
                }
            }
        },
        friend_help: {
            title: 'Friend Reaches Out',
            description: 'An old friend hears your situation and offers help.',
            choices: {
                accept: { text: 'Accept Help', hint: (money, mental, shelterMental) => `+$${money || 1000}, M+${mental}, or temporary shelter (mental boost)` },
                decline: { text: 'Decline Politely', hint: (mental, social) => `Keep pride, M+${mental}, S+${social}` }
            },
            messages: {
                shelter: 'Your friend takes you in. You finally have somewhere to stay.',
                money: (amount) => `Your friend lends you $${amount || 1000}.`,
                decline: (mental) => `You choose to face it alone. M+${mental}.`
            }
        },
        sell_artifact_crisis: {
            title: 'Sell Heirloom for Survival',
            description: 'Debt collectors are at your door. Selling your artifact may buy a few days of peace.',
            choices: {
                sell: {
                    text: 'Sell It',
                    hint: (gain, mentalLoss) => `Sell artifact for $${gain}, M-${mentalLoss}`
                },
                keep: {
                    text: 'Keep It',
                    hint: (mentalGain) => `Keep artifact, M+${mentalGain}, debt crisis continues`
                }
            },
            messages: {
                sell: (gain) => `You pawn the artifact for $${gain}. The relief feels temporary.`,
                keep: 'You keep it at all costs. This is your last hope.'
            }
        },
        black_market_artifact: {
            title: 'Black Market Deal',
            description: 'A hidden dark-web seller offers "special" items. Do you gamble?',
            choices: {
                buy: {
                    text: 'Buy Mystery Box',
                    hint: (cost) => `Pay $${cost} for one random artifact`
                },
                leave: {
                    text: 'Leave',
                    hint: 'Not interested'
                }
            },
            messages: {
                buy: (name) => `Deal complete. You obtained: ${name}.`,
                leave: 'You close the page and keep your emergency cash.'
            }
        },
        gig_accident: {
            title: 'Delivery Accident',
            description: 'You crash during a delivery. The claims officer asks what happened.',
            choices: {
                truth: {
                    text: 'Tell the Truth: On Delivery',
                    hint: (cost, mental) => `Claim denied, pay -$${cost}, M-${mental}`
                },
                lie: {
                    text: 'Lie: Personal Driving',
                    hint: (chance, cost, success) => `${chance}% to get away with it (success +$${success}, fail -$${cost})`
                },
                fraud: {
                    text: 'Admit Commercial Use',
                    hint: (cost) => `Claim denied, pay -$${cost}`
                }
            },
            messages: {
                denied: (cost) => `Coverage denied for commercial use. You pay $${cost}.`,
                fraud: (fine) => `Insurance fraud detected. Fine: $${fine}, credit score tanks.`,
                covered: (cost) => `You slip through this time. Out-of-pocket: $${cost}.`,
                lieSuccess: 'Insurance buys your story and pays the damage.',
                lieFail: (cost) => `Fraud flagged. Fine: $${cost}, credit score tanks.`
            }
        },
        hospital_stay: {
            description: (health, target, daysLeft, cost) => `You are hospitalized.\nHealth: ${health} / Target: ${target} (about ${daysLeft} day(s))\nDaily ward cost: $${cost}`,
            choices: {
                paidLeave: { text: 'Follow Treatment (Paid Leave)', hint: 'Use 1 PTO, salary protected' },
                restDay: { text: 'Follow Treatment (Rest Day)', hint: 'Pay ward fee only, no leave needed' },
                unpaidLeave: { text: 'Follow Treatment (Unpaid Leave)', hint: (percent) => `Lose ${percent}% monthly salary, firing risk rises` },
                selfPay: { text: 'Follow Treatment (Self Pay)', hint: 'Use savings to recover' },
                ama: { text: 'Leave AMA', hint: (health, mental) => `Requires health >= ${health}, M-${mental}` }
            },
            messages: {
                paidLeave: 'You rest in hospital for a day while salary continues.',
                restDay: 'You spend your rest day in hospital and recover steadily.',
                unpaidSickLeave: (dailyPay) => `Unpaid sick leave: monthly salary reduced by about $${dailyPay}`,
                firedWithInsurance: 'Bad news: you are fired for prolonged absence. Employer health insurance expires tomorrow.',
                fired: 'Bad news: you are fired for prolonged absence.',
                fireRisk: (percent) => `Unpaid recovery in progress... firing risk ${percent}%`,
                selfPay: 'You continue treatment in hospital.',
                ama: 'You sign AMA discharge and leave while still weak. Relapse risk remains.'
            }
        }
    }
};

const enFinalOverrides = {
    data: {
        lunch_hints: {
            too_expensive: (cost) => `Insufficient balance (need $${cost})`
        },
        night_choices: {
            phone_social: {
                hint: (social, mental, energyPenalty) => `S+${social}, M+${mental}, tomorrow energy ${energyPenalty > 0 ? `+${energyPenalty}` : energyPenalty}`
            },
            prepareMeal: {
                hint: (ingredients, energyBonus, mental) => `-${ingredients} ingredients, M+${mental}, tomorrow energy ${energyBonus > 0 ? `+${energyBonus}` : energyBonus}`
            },
            grocery: {
                hint: (cost, ingredients, energyBonus) => `-$${cost}, +${ingredients} ingredients, tomorrow energy ${energyBonus > 0 ? `+${energyBonus}` : energyBonus}`
            }
        },
        mental_restoration: {
            psychotherapy: {
                hint: (cost, maxGain, gain) => `-$${cost}, Max M +${maxGain}, M+${gain}`
            },
            nature_retreat: {
                hint: (cost, energy, maxGain, gain) => `-$${cost}, E-${energy}, Max M +${maxGain}, M+${gain}`
            },
            meditation_insight: {
                choices: {
                    embrace: {
                        hint: (gain) => `Max M +${gain}`
                    }
                }
            },
            volunteer_work: {
                hint: (energy, maxGain, social) => `E-${energy}, Max M +${maxGain}, S+${social}`
            }
        },
        endings: {
            bankrupt: {
                title: 'Financial Collapse',
                subtitle: 'Your Bank Account Is Empty',
                message: 'No savings, no income, frozen cards. In Country M, bankruptcy is only the beginning of the fall.'
            },
            homeless: {
                title: 'Homeless',
                subtitle: 'You Lost Your Last Shelter',
                message: 'From apartment to car, from car to the street. Without a fixed address, even job applications become difficult.'
            },
            healthCollapse: {
                title: 'Health Collapse',
                subtitle: 'Your Body Can No Longer Endure',
                message: 'Without insurance, every warning sign was ignored. Eventually one ER bill became the final blow.'
            },
            mentalBreakdown: {
                title: 'Mental Breakdown',
                subtitle: 'You Chose to Give Up',
                message: 'Pressure, anxiety, and despair pile up until your mental defenses collapse.'
            },
            exhaustion: {
                title: 'Exhaustion',
                subtitle: 'Final Warning from Your Body',
                message: 'Chronic sleep deprivation and overwork force your body to shut down.'
            },
            survived: {
                title: 'Survivor',
                subtitle: 'You Survived 365 Days',
                message: 'You survived one year on Country M\'s kill line. Is this victory, or just another year of struggle?'
            },
            debtSpiral: {
                title: 'Death Spiral',
                subtitle: 'The Dominoes Fell',
                message: 'One unaffordable repair triggered lateness, job loss, default, and eviction. Poverty is not a state, but a downward spiral.'
            }
        }
    },
    game: {
        log: {
            marketDenial: (assetName) => `[Market] Debunked: rumor about ${assetName} has been denied, volatility cools down.`,
            marketDefiance: (title) => `[Market] 🤯 Market ignored "${title}" and moved in the opposite direction!`,
            marketStatus: (sentiment, news) => `[Market] Sentiment=${sentiment}, News=${news || 'None'}`,
            useCarCommute: (remaining, capacity) => `[Game] Commute by car. Fuel left ${remaining}/${capacity}`,
            refuel: (cost, remaining, capacity) => `[Game] Refuel -$${cost}, fuel ${remaining}/${capacity}`,
            repairCar: (cost) => `[Game] Car repair -$${cost}, fixed but guaranteed late`,
            taskOverdue: (days, risk) => `[Game] Task overdue by ${days} day(s), PIP risk: ${risk * 100}%`,
            bentoExpired: '[Game] Packed lunch not consumed, expired',
            lostEmployerInsurance: '[Game] Job lost, employer insurance terminated',
            gotEmployerInsurance: '[Game] Full-time employment gained, auto-enrolled in employer basic health plan'
        },
        artifactTriggers: {
            gig_cap: (bonus) => `🧢 Hustler Cap: +$${bonus}`,
            gopro_camera: (reward) => `📹 Action Camera: injury payout +$${reward}`,
            bull_plushie: (percent) => `🐂 Bull Plushie: gains +${percent}%`,
            grinder_tie: (mental) => `👔 Grindset Tie: M +${mental}`,
            jammed_copier: (gain) => `🖨️ Jammed Copier: extra progress +${gain}%`,
            neural_chip: (gain) => `💾 Neural Implant: extra progress +${gain}%`,
            mom_credit_card: (saved) => `💳 Magic Credit Card: saved $${saved}`,
            quantum_meditation_mat: (amount) => `🧘 Quantum Mat: H +${amount}`,
            streamer_mic: (amount) => `🎤 Streamer Mic: +$${amount}`,
            super_vitamin: (amount) => `💊 Super Vitamin: M +${amount}`,
            gopro_camera_medical: '[Action Camera] Medical cost increased',
            blood_contract: '[Blood Contract] Gains doubled'
        },
        artifactDaily: {
            ticker_insider_label: '[Insider Intel]',
            modal_insider_title: 'Core Insider Intel',
            modal_news_title: 'Market News',
            modal_confirmed_badge: 'Confirmed',
            modal_no_insider: 'No insider intel today.',
            modal_no_news: 'No major market news today.',
            modal_news_sentiment: 'Sentiment Impact:',
            modal_rumor_title: '🔍 Market Rumor',
            modal_rumor_notice: (day) => `Note: this rumor is unconfirmed and is expected to resolve on Day ${day}.`,
            piggy_bank: (bonus) => `🪙 Piggy Bank: no-spend bonus +$${bonus}`,
            insider_phone_tip: (assetName) => `📱 Insider tip: ${assetName} may surge tomorrow`,
            insider_phone_fine: (fine) => `📱 Insider Phone: fined -$${fine}`,
            insider_phone_detail: (assetName) => `${assetName} is expected to show significant volatility tomorrow.`,
            golden_parachute: (assetName, price, proceeds) => `🪂 Golden Parachute: ${assetName} hit stop-loss @$${price}, recovered $${proceeds}`
        },
        finance: {
            rentersInsuranceActive: 'Renters insurance is now active',
            rentersInsuranceCancelled: 'Renters insurance canceled',
            salaryNoIncrease: 'Performance review: salary unchanged this month.',
            fainting: (mentalPenalty, healthPenalty) => `⚠️ Energy depleted. You blacked out and took permanent damage (Max M -${mentalPenalty}, Max H -${healthPenalty})`,
            socialIsolation: (penalty) => `⚠️ Isolation is draining your mind (M -${penalty})`,
            socialDeath: (healthPenalty, mentalPenalty) => `☠️ Social collapse. Body and mind crash together (H -${healthPenalty}, M -${mentalPenalty})`,
            socialJobImpact: (penalty) => `📉 Social friction hurts work efficiency (Efficiency -${penalty})`,
            rentInsufficient: (amount) => `🏠 Rent paid with shortage: -$${amount}`,
            insurancePlanChanged: (name) => `📋 Health plan changed to: ${name}`,
            carInsuranceChanged: (name) => `🚗 Car insurance changed to: ${name}`,
            waitingForDoctor: (damage) => `⏳ Waiting for doctor: H -${damage}`,
            waitingSurgeryApproval: (damage) => `⏳ Waiting for surgery approval: H -${damage}`,
            medicaidApproved: '✅ Medicaid approved! Medical costs are now fully covered.',
            medicaidDenied: '❌ Medicaid denied: assets or income do not meet eligibility.',
            emergencyMedical: (amount) => `🚑 Emergency self-pay: -$${amount}`,
            investmentBoom: (percent, bonus) => `🚀 Portfolio surge ${percent}%! Mental +${bonus}`,
            investmentCrash: (percent, penalty) => `📉 Portfolio drop ${percent}%! Mental -${penalty}`,
            chronicFatigue: (penalty) => `⚠️ Chronic fatigue: Health -${penalty}`,
            severeOverwork: (penalty) => `⚠️ Severe overwork: Health -${penalty}`,
            salaryIncrease: (amount, current) => `💰 Performance review: salary +$${amount} (now $${current})`,
            rentIncrease: (amount, current) => `🏠 Market pressure: rent +$${amount} (now $${current})`
        },
        medical: {
            medicaidCoverage: 'Medicaid fully covers this cost',
            noInsurance: 'No insurance, full out-of-pocket payment',
            outOfNetwork: 'Out-of-network provider encountered',
            denied: 'Insurance denied claim as non-emergency',
            reachedAnnualMax: 'Annual max reached, insurer covers all remaining eligible costs',
            deniedBreakdown: (note) => `Insurance denial (${note})`,
            outOfNetworkBreakdown: (base, final) => `Out-of-network full self-pay ($${base} -> $${final})`,
            deductible: (amount) => `Deductible: $${amount}`,
            coinsurance: (percent, amount) => `Coinsurance (${percent}%): $${Math.round(amount)}`
        },
        status: {
            unknown: 'Unknown'
        },
        save: {
            invalidSlot: (id) => `[Game] Invalid save slot: ${id}`,
            saved: (id) => `[Game] Saved to slot ${id}`,
            noSave: (id) => `[Game] No save data in slot ${id}`,
            loaded: (id, day) => `[Game] Loaded slot ${id}, day ${day}`,
            deleted: (id) => `[Game] Save in slot ${id} deleted`,
            readFailed: (id) => `[Game] Failed to read slot ${id}:`,
            saveFailed: '[Game] Save failed:',
            loadFailed: '[Game] Load failed:'
        }
    },
    ui_static: {
        help: {
            work_quote: '"Sometimes you trade dignity to keep your job, and trade savings to keep dignity."',
            random_title: 'Randomness',
            random_text: 'You can enter a fixed seed for deterministic runs, or leave blank for a fully random life.'
        },
        start: {
            help_label: 'Guide'
        },
        finance: {
            prepared: 'Prepared',
            ingredients_count: (count) => `Ingredients: ${count}`,
            day_count: (days) => `${days}d`,
            overdue_days: (days) => `Overdue ${days}d`
        },
        event: {
            select_commute: '🚗 Choose commute method:',
            select_lunch: '🍱 Choose lunch strategy:',
            select_daily_action: '✨ Side action:',
            select_incident: '⚠️ Incident:'
        },
        modals: {
            message_history: 'Message History',
            artifact_select_title: '📦 Choose Your Starting Artifact',
            artifact_select_subtitle: 'Think of it as your spawn trait - pick one and shape this run.',
            artifact_select_action: 'Click to select',
            news_detail: '📰 Market Intel'
        },
        dev_editor: {
            ingredients: 'Ingredients',
            job: 'Job Status'
        }
    },
    ui: {
        dayToast: {
            energyUnchanged: '⚡ Energy unchanged',
            energyRecovered: (delta) => `⚡ Energy recovery: ${delta}`,
            energyChanged: (delta) => `⚡ Energy change: ${delta}`,
            mentalPart: (delta) => `Mental ${delta}`,
            healthPart: (delta) => `Health ${delta}`,
            housingBonus: (parts) => `🏠 Housing bonus: ${parts}`,
            restDay: '🎉 Rest day! Enjoy it',
            newDayNeutral: '☀️ A New Day',
            newDayPositive: '🚀 A Promising Day',
            newDayHard: '📉 A Tough Day',
            paydayIn: (days) => `Payday in ${days} day(s)`,
            forcedSleep: '😵 Exhausted. You pass out immediately...'
        },
        side: {
            lunchLabel: 'Lunch',
            healthPlus: (value) => `Health +${value}`,
            latePenalty: (energyPenalty, mentalPenalty) => `You are late! E-${energyPenalty}, M-${mentalPenalty}`,
            pipPenalty: (scorePenalty) => `PIP score -${scorePenalty}`
        },
        confirm: {
            returnToTitleHeader: 'Return to Title',
            deleteSlotHeader: 'Delete Save'
        },
        validation: {
            pleaseSelectPrefix: 'Please select:',
            previewHint: (list) => `Preview available. Before advancing, please select: ${list}`
        },
        dev_editor: {
            money: 'Savings ($)',
            energy: 'Energy (0-100)',
            mental: 'Mental (0-100)',
            health: 'Health (0-100)',
            social: 'Social (0-100)',
            efficiency: 'Efficiency (0-100)'
        }
    },
    events: {
        hospital_stay: {
            descRestDay: '\nToday is a rest day. Focus on recovery.',
            descPtoAvailable: (days) => `\nPTO available: ${days} day(s).`,
            descPtoWarning: '\nWarning: PTO is exhausted. Continued hospitalization cuts salary and increases firing risk.'
        },
        traffic_accident: {
            message: 'Traffic accident! Vehicle damaged and needs repair. Repair -$${0}, Health -{1}, Mental -{2}.'
        }
    },
    // ========== Game Manual (English placeholder - TODO: translate) ==========
    manual: {
        title: 'Killzone Survivor Game Guide',
        subtitle: 'This guide is designed for first-time players, following the sequence: "Understand the Interface → Complete a Day → Manage Debt & Status → Survive/Turn Around".',

        tips: {
            rng: 'This game uses "Seeded RNG" to drive random events and market fluctuations; key random sequences can be reproduced with the same seed.',
            disclaimer: 'Disclaimer: This game is a work of fiction. All characters, organizations, cities, and events are fictional. Any resemblance is purely coincidental. Please do not interpret it as reality.'
        },

        sections: [
            {
                id: 'intro',
                title: '1. What Are You Playing',
                content: [
                    'You play as an ordinary person struggling in a high-cost city: simultaneously battling **bill countdowns**, **health/mental/energy**, **work task pressure**, and **debt interest**. The core of the game is not to "win once", but to avoid being dragged into the "kill chain" by chain reactions.',
                    'If you collapse on any line (money/health/mental/credit/employment), subsequent costs will increase exponentially.'
                ]
            },
            {
                id: 'daily_cycle',
                title: '2. How a Day Progresses (Core Loop)',
                content: 'The game progresses by days, but each day is divided into multiple periods:',
                list: [
                    '`Daytime`: Handle work-related events and complete daily "commute/lunch/extra action/sudden" choices.',
                    '`Night`: More focused on life and risk (may also see "omens/rumors").',
                    '`Late Night`: End of the day, then enter the next day.'
                ],
                note: 'Key point: Event cards usually offer multiple choices; you first select an option, and the interface updates with a "preview state". For choices with randomness, the preview hides random results (to avoid spoilers); you need to confirm before actual settlement.'
            },
            {
                id: 'time_cycle',
                title: '2.1 Time and Cycles (Must Read)',
                content: 'To make "bill pressure" stronger, this game compresses time into shorter cycles (the interface also uses countdowns to remind you, you don\'t need to memorize):',
                list: [
                    '`4 days = 1 week`: Used to determine "rest day" and other weekly rhythm events (e.g., days where `day % 4 === 0` are usually considered rest days).',
                    '`10 days = 1 month`: Used for rent/insurance/utilities/payday and other "monthly rhythm" settlements and countdowns.'
                ],
                note: 'Understanding: You need to prepare for the next cycle\'s fixed expenses within a very short 10-day cycle; once there\'s a gap, credit/debt/health will drag you into the kill chain.'
            },
            {
                id: 'startup_flow',
                title: '2.2 Startup Flow (From Title Screen to Day 1)',
                content: 'The startup flow is a fixed "initialization", recommended to complete in one go:',
                list: [
                    'Select save slot (new game/continue).',
                    'Enter or generate `Seed`. Leaving it blank works too: the system will auto-generate and fill it, ensuring subsequent "starting artifact draw" and this game\'s random sequence are consistent.',
                    'Select starting housing (affects monthly rent and daily recovery/bonuses).',
                    'Draw and select starting artifact: Choose 1 from 3 random artifacts as your starting hand.',
                    'After entering the game, an "auto-payment setup" guide usually pops up (recommend setting a higher retained cash first).'
                ]
            },
            {
                id: 'main_interface',
                title: '3. How to Read the Main Interface',
                content: 'The main interface consists of two parts: the **Dashboard** above (your current survival status), and the **Event Cards** below (what you need to do today).',
                image: {
                    src: 'assets/images/Explanation/en/ui_dashboard_light.jpg',
                    alt: 'Main Interface (Daytime: Commute+Lunch+Events)',
                    width: 400
                }
            },
            {
                id: 'core_status',
                title: '3.1 Left Side Five Core Status Bars',
                list: [
                    '`Energy`: Determines if you can handle work and consecutive events.',
                    '`Mental`: Long-term pressure accumulation; reaching zero triggers a breakdown ending.',
                    '`Health`: Determines if you enter the "medical/hospital/medical debt" chain.',
                    '`Social`: Low social continuously drains mental; extremely low triggers more severe chain penalties.',
                    '`Work Ability`: Affects work income and risk (e.g., task progress, performance pressure).'
                ]
            },
            {
                id: 'info_cards',
                title: '3.2 Right Side Info Cards (Housing/Job/Artifact/Bento/Bills/Salary)',
                content: 'These cards are "the foundation of each day". Especially recommend frequently checking: housing, bills, financial details.',
                images: [
                    { src: 'assets/images/Explanation/en/icon_small_1.jpg', alt: 'Housing Card (Example: Apartment)', width: 150 },
                    { src: 'assets/images/Explanation/en/icon_small_2.jpg', alt: 'Artifact Card Entry (Illustration)', width: 150 },
                    { src: 'assets/images/Explanation/en/ui_mini_status.jpg', alt: 'Monthly Bill Card (Countdown Reminder)', width: 150 }
                ]
            },
            {
                id: 'deposit_card',
                title: '3.3 Deposit Card (Cash/Investment/Debt at a Glance)',
                content: 'The deposit card is your most commonly used "decision panel": Is there enough cash to last until the next settlement? Can investment gains/losses save you? Is debt snowballing?',
                image: {
                    src: 'assets/images/Explanation/en/icon_wide_element.jpg',
                    alt: 'Deposit Card (Cash+Investment+Debt)',
                    width: 300
                }
            },
            {
                id: 'housing',
                title: '4. Housing: Sleep Recovery and Long-term Bonuses',
                content: 'Housing card entry (example: apartment)',
                image: {
                    src: 'assets/images/Explanation/en/icon_small_1.jpg',
                    alt: 'Housing Card Entry (Example: Apartment)',
                    width: 150
                },
                note: 'Housing affects: daily energy recovery (sleep quality), daily mental/health bonuses (long-term environment), rent (fixed cycle settlement). Click the housing card to view details and change.',
                image2: {
                    src: 'assets/images/Explanation/en/scene_event_card.jpg',
                    alt: 'Housing Details (Apartment Example)',
                    width: 400
                },
                subsections: [
                    {
                        title: 'Common Housing (Illustrative, specific values in-game)',
                        list: [
                            '`Apartment`: Higher rent; better energy recovery, better mental bonuses.',
                            '`Cheap Room`: Low cost, but long-term negative effects on mental/health.',
                            '`Car/Homeless`: Almost no rent, but recovery and bonuses are very poor, easy to slide into the collapse chain.'
                        ]
                    }
                ]
            },
            {
                id: 'billing',
                title: '5. Bills and Finance: Two Panels You\'ll Open Most Often',
                subsections: [
                    {
                        title: '5.1 Bill Details: Future Fixed Expense Countdown',
                        content: 'Monthly bill entry (countdown reminder)',
                        image: {
                            src: 'assets/images/Explanation/en/ui_mini_status.jpg',
                            alt: 'Monthly Bill Entry (Countdown Reminder)',
                            width: 150
                        },
                        note: 'Bills are settled by cycle (rent, insurance, utilities, etc.). As you get closer to settlement day, this is the most intuitive risk indicator.',
                        image2: {
                            src: 'assets/images/Explanation/en/ui_investment_screen.jpg',
                            alt: 'Bill Details (Rent/Insurance/Utilities and Countdown)',
                            width: 400
                        }
                    },
                    {
                        title: '5.2 Financial Details: Cash/Holdings/Debt/Repayment and Auto-payment',
                        content: 'Click the deposit card on the main interface to enter "Financial Details". Here you can:',
                        list: [
                            'See `Available Funds` and `Holdings Value`',
                            'View `Total Debt`',
                            'Manually enter amount to repay (supports "Max")'
                        ],
                        image: {
                            src: 'assets/images/Explanation/en/scene_main_interface.jpg',
                            alt: 'Financial Details (Cash+Holdings+Debt+Repayment)',
                            width: 400
                        }
                    },
                    {
                        title: '5.3 Auto-payment: Reduce Daily Operations, But Keep a Safety Cushion',
                        content: 'Auto-payment uses "idle funds" to repay debt at the end of each day; you can set:',
                        list: [
                            'Whether to enable',
                            '`Retained Cash`: Safety cushion not participating in repayment',
                            '`Daily Maximum Repayment`: Control cash outflow speed'
                        ],
                        image: {
                            src: 'assets/images/Explanation/en/scene_square_icon.jpg',
                            alt: 'Auto-payment Settings (On/Off/Retained Cash/Daily Limit)',
                            width: 400
                        },
                        note: 'Suggestion: Before familiarizing with version rhythm, set retained cash higher first to avoid being drained by auto-payment and unable to eat/commute the next day.'
                    }
                ]
            },
            {
                id: 'investment',
                title: '6. Investment and Finance: Exchange Volatility for Opportunity',
                content: 'The investment page provides multi-asset categories and "watchlist" summary; you will see:',
                list: [
                    'Market sentiment bar (Panic → Greed)',
                    'Available funds / Holdings value / Total assets',
                    'Category tabs: `Watchlist`, `Gold/Commodities`, `Stocks/ETFs`, `Crypto`',
                    'Comprehensive return chart, today\'s/cumulative gains/losses'
                ],
                image: {
                    src: 'assets/images/Explanation/en/scene_main_interface.jpg',
                    alt: 'Investment Page (Basic View: Watchlist/Categories/Gains)',
                    width: 400
                },
                note: 'Market news and rumors affect trends (sometimes "rumors" appear first, then may be "confirmed/debunked" later).',
                image2: {
                    src: 'assets/images/Explanation/en/ui_dashboard_dark.jpg',
                    alt: 'Investment Page (With Rumors and Chart Example)',
                    width: 400
                }
            },
            {
                id: 'news_system',
                title: '6.1 News System Explained',
                image: {
                    src: 'assets/images/Explanation/en/news.png',
                    alt: 'News Ticker Example',
                    width: 400
                },
                content: 'Click the news ticker above to enter the market intel interface.',
                image2: {
                    src: 'assets/images/Explanation/en/news_view.jpg',
                    alt: 'Market Intel Interface',
                    width: 400
                },
                subsections: [
                    {
                        title: 'News Three Phases',
                        list: [
                            '**Rumor Phase**: Market rumors have a chance to generate at night, news title marked with [Rumor], rumor phase only affects market sentiment, not directly affecting prices.',
                            '**Confirmed Phase**: Rumors auto-confirm T+2 days after generation, confirmed news effects actually apply to asset prices (effect amplified 1.4x).',
                            '**Debunked Phase**: Non-insider rumors have 50% chance to be debunked, debunked news produces no market effect. Insider tips always confirm, never debunk.'
                        ]
                    },
                    {
                        title: 'Market Defiance Mechanism (20% Chance)',
                        content: 'Even when news is confirmed, market has **20% chance to move in opposite direction**. This means don\'t All-in on single news direction, maintain risk control.'
                    },
                    {
                        title: 'News Impact on Different Assets',
                        list: [
                            '**Tech News**: Affects tech stocks (Tech Giant) and broad index (S&P 500)',
                            '**Energy News**: Affects energy sector, may also affect utility bills',
                            '**Crypto News**: Affects BTC, ETH, altcoins and other cryptocurrencies',
                            '**Macro News**: Affects gold (safe haven) and overall market sentiment',
                            '**Biotech News**: Affects biotech stocks (Biotech)',
                            '**Real Estate News**: Affects REITs and other real estate investments'
                        ]
                    },
                    {
                        title: 'Market Sentiment Correlation',
                        list: [
                            'Panic news (negative) → Risk assets fall, gold rises',
                            'Greed news (positive) → Risk assets rise',
                            'Sentiment bar shows current overall market sentiment (-100 Panic ~ +100 Greed)'
                        ]
                    },
                    {
                        title: 'Practical Strategies',
                        list: [
                            '**Position during rumor, harvest at confirmation**: Buy low during rumor phase, sell when price rises after confirmation',
                            '**Diversify bets**: Don\'t go all-in on single asset, prevent debunking or market defiance',
                            '**Watch gold**: When panic sentiment is high, gold as safe haven often rises against the trend',
                            '**Prioritize insider**: When getting insider tips, can bet boldly (won\'t be debunked)',
                            '**Leave room**: Even with confirmed news, guard against 20% market defiance chance'
                        ]
                    }
                ],
                note: 'Strategy tip: Investment returns are "volatile emergency money", don\'t gamble with tomorrow\'s rent money. When market sentiment leans panic, risk assets are more prone to sharp drops; when leaning greedy, pullbacks hurt more.'
            },
            {
                id: 'insurance',
                title: '7. Insurance: Turn Sky-high Risks into Manageable Bills',
                content: 'The insurance page usually includes:',
                list: [
                    '`Health Insurance`: Monthly premium, deductible progress, etc.',
                    '`Car Insurance`: Liability/Full coverage options',
                    '`Renters Insurance`: Purchase/cancel monthly'
                ],
                image: {
                    src: 'assets/images/Explanation/en/scene_purple_theme.jpg',
                    alt: 'Insurance Center (Health/Car/Renters Insurance)',
                    width: 400
                },
                note: 'Tip: Some plan changes take effect "next cycle/next month", don\'t wait until the day of incident to remember changing plans.'
            },
            {
                id: 'artifacts',
                title: '8. Artifacts: Small Privileges, But They Change Your Decisions',
                content: 'Artifact card entry',
                image: {
                    src: 'assets/images/Explanation/en/icon_small_2.jpg',
                    alt: 'Artifact Card Entry (Illustration)',
                    width: 150
                },
                note: 'Artifacts are "biasers" for survival rhythm. They will shift your daily decisions from "random clicks" to "conditionally optimal".',
                subsections: [
                    {
                        title: '8.1 Slots and Acquisition',
                        list: [
                            'Slot limit: `3` (interface shows `current/limit`).',
                            'Starting: Draw 3 random artifacts, choose 1 as your starting hand.',
                            'In-game: Some events reward artifacts; if slots are full, usually let you "replace an existing artifact" or skip.'
                        ]
                    },
                    {
                        title: '8.2 When Do Artifacts Trigger',
                        content: 'Different artifacts trigger at different times, but common ones include:',
                        list: [
                            '`onInit`: Triggers when equipped at start (determines this run\'s underlying rhythm).',
                            '`onDaily`: Triggers every morning (more like "daily passive").',
                            '`onStatsChange`: Triggers when your attributes change (e.g., money/health/mental/energy gains/losses), may produce chain reactions.'
                        ],
                        note: 'When chain triggers occur, you\'ll see prompts pop up one by one, and the artifact slot on the main interface may glow to indicate "who is acting".',
                        image: {
                            src: 'assets/images/Explanation/en/scene_horizontal_view.jpg',
                            alt: 'My Artifacts (Detail Popup Example)',
                            width: 400
                        }
                    },
                    {
                        title: '8.3 What to Do When Slots Are Full (Replacement Strategy)',
                        content: 'When slots are full but you encounter an opportunity to "get a new artifact", common thinking is:',
                        list: [
                            'First look at the new artifact\'s "trigger timing" and "constraints" (e.g., requires no spending that day, requires certain attribute in threshold range).',
                            'Then look at where your current kill risk comes from (health/debt/work/social).',
                            'Replace an artifact that no longer provides benefit with one that can directly break the kill chain.'
                        ]
                    }
                ]
            },
            {
                id: 'endings',
                title: '9. Common Endings and Turnaround Goals (Avoid Pitfalls)',
                content: 'Different versions may adjust thresholds, but the general direction is the same:',
                list: [
                    '`Debt Spiral`: High debt gets continuously crushed by interest and fixed expenses.',
                    '`Health Collapse`: Health reaches zero, medical chain tears apart money and credit.',
                    '`Mental Breakdown`: Mental reaches zero, game ends directly.',
                    '`Bankruptcy/Homeless`: No money + unemployed/bad credit combination triggers.',
                    '`Financial Freedom/Survival Victory`: Meet savings or survival days goal.'
                ],
                note: 'Beginner priority goals: First memorize "fixed expense countdowns" (payday/rent/insurance/utilities). Always keep a cash safety cushion. Don\'t tough out consecutive risks when energy is bottomed out; that\'s when chain reactions are most easily triggered.'
            },
            {
                id: 'log_report',
                title: '10. Message Log and Daily Report: Track Your Every Step',
                content: 'The game automatically records important game events and financial changes, helping you track "what happened".',
                image: {
                    src: 'assets/images/Explanation/log.png',
                    alt: 'Message Log Button',
                    width: 80
                },
                subsections: [
                    {
                        title: '10.1 Message Log (History)',
                        content: 'Click the 📜 **History** button on the interface (usually at bottom right or side) to open the message log modal:',
                        list: [
                            '**Record Content**: Important events, artifact triggers, status changes, system prompts, etc.',
                            '**Grouped by Day**: Log displays grouped by game day for easy review',
                            '**Period Markers**: Each log entry notes the period (day/night/late night)',
                            '**Type Indicators**: Different message types have different styles (normal/warning/positive, etc.)',
                            '**Memory Optimization**: Only keeps last 2 days of logs to avoid information overload'
                        ],
                        note: 'Usage tip: When unsure "why my money decreased" or "where did this effect come from", check the log. When artifact chain triggers, log shows trigger sequence. After daily settlement, scan the log to confirm no unexpected losses.'
                    },
                    {
                        title: '10.2 Daily Financial Report',
                        content: 'At each day\'s settlement, the system generates a financial report summarizing the day\'s income and expenses:',
                        list: [
                            '**Income Sources**: Salary, investment gains, artifact rewards, etc.',
                            '**Expense Items**: Rent, insurance, utilities, medical, commute, meals, etc.',
                            '**Debt Changes**: New debt, auto-payment, interest accumulation, etc.',
                            '**Exceptions**: Claim denials, fines, unexpected expenses, etc.'
                        ]
                    },
                    {
                        title: '10.3 Why Logs Are Important',
                        content: 'In high-pressure survival games, information is life:',
                        list: [
                            '**Prevent mysterious collapse**: Often losses are cumulative, logs help discover hidden costs',
                            '**Verify artifact effects**: Confirm artifacts trigger correctly, damage/gains match expectations',
                            '**Learn game mechanics**: Observe logs to understand chain consequences of different choices',
                            '**Troubleshoot issues**: When encountering unexpected endings, review logs to find key turning points'
                        ],
                        note: 'Memory trick: Make it a habit - after progressing to night each day, first click 📜 to scan today\'s log, confirm no missed important info before saving.'
                    }
                ]
            },
            {
                id: 'quick_start',
                title: '11. Quick Start (Recommended)',
                list: [
                    'Daytime first choose commute: When unsure, choose the safer option.',
                    'Then choose lunch strategy: Eat bento if possible, don\'t force fast food; health chain is hard to repair.',
                    'Then handle event choices: First survive (health/mental/energy) then talk about gains.',
                    'Every few days open: `Bill Details` + `Financial Details`, arrange cash and repayment in advance.',
                    'At end of each day click 📜 **History**, confirm today\'s income/expenses and events have no anomalies.',
                    'After funds are comfortable, then consider: investment and insurance upgrades.'
                ]
            }
        ]
    }
};

function isPlainObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value);
}

function mergeLocale(base, override) {
    if (!isPlainObject(base) || !isPlainObject(override)) {
        return override === undefined ? base : override;
    }

    const result = { ...base };
    for (const key of Object.keys(override)) {
        result[key] = mergeLocale(base[key], override[key]);
    }
    return result;
}

export const en = mergeLocale(mergeLocale(mergeLocale(zh, enOverrides), enMoreOverrides), enFinalOverrides);
