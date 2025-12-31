import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(express.static('.'));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 1. MASSIVE MEAL DATABASE (25+ Options with Specific Portions)
const mealDB = {
    "middle eastern": {
        breakfast: [
            { name_ar: "فول مدمس", desc_ar: "1 كوب فول (200غ) + 1 ملعقة زيت + كمون", cal: 340, tags: ["vegan", "gluten_free"] },
            { name_ar: "ساندويش لبنة", desc_ar: "رغيف قمح صغير (50غ) + 3 ملاعق لبنة", cal: 280, tags: ["lactose", "gluten", "vegetarian"] },
            { name_ar: "بيض مسلوق", desc_ar: "2 بيضة مسلوقة + رشة دقة + خيار", cal: 220, tags: ["gluten_free", "vegetarian"] },
            { name_ar: "منقوشة جبنة", desc_ar: "نصف منقوشة (قطر 15سم) + خضار", cal: 350, tags: ["gluten", "lactose", "vegetarian"] },
            { name_ar: "حمص وخضار", desc_ar: "6 ملاعق حمص + 1 جزر + 1 خيار", cal: 300, tags: ["vegan", "gluten_free"] },
            { name_ar: "فتة حمص", desc_ar: "6 ملاعق حمص + نصف رغيف محمص + 4 ملاعق لبن", cal: 450, tags: ["gluten", "lactose", "vegetarian"] },
            { name_ar: "شكشوكة", desc_ar: "2 بيضة مطبوخة مع 1 طماطم وبصل", cal: 320, tags: ["gluten_free", "vegetarian"] },
            { name_ar: "جبنة حلوم", desc_ar: "3 شرائح حلوم (90غ) مشوية + طماطم", cal: 280, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "مسبحة", desc_ar: "5 ملاعق مسبحة + 1 ملعقة تتبيلة حارة", cal: 380, tags: ["vegan", "gluten_free"] },
            { name_ar: "قلاية بندورة", desc_ar: "2 طماطم مقلية + ثوم + ربع رغيف", cal: 200, tags: ["vegan", "gluten"] },
            { name_ar: "مناقيش زعتر", desc_ar: "نصف منقوشة زعتر + كوب شاي بدون سكر", cal: 300, tags: ["gluten", "vegan"] },
            { name_ar: "بيض عيون", desc_ar: "2 بيض مقلي بملعقة صغيرة زيت", cal: 250, tags: ["gluten_free", "vegetarian"] },
            { name_ar: "سلطة لبنة", desc_ar: "4 ملاعق لبنة + خيار ونعنع وزيتون", cal: 200, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "شوفان بالحليب", desc_ar: "5 ملاعق شوفان + 1 كوب حليب قليل الدسم", cal: 350, tags: ["lactose", "gluten", "vegetarian"] },
            { name_ar: "توست أفوكادو", desc_ar: "1 توست أسمر + نصف أفوكادو مهروس", cal: 280, tags: ["gluten", "vegan"] },
            { name_ar: "فلافل (مشوي)", desc_ar: "4 أقراص فلافل مشوية + طحينة", cal: 320, tags: ["vegan", "gluten_free"] },
            { name_ar: "ساندويش حلوم", desc_ar: "ربع رغيف + 2 شريحة حلوم + خس", cal: 300, tags: ["gluten", "lactose", "vegetarian"] },
            { name_ar: "بيض بالأعشاب", desc_ar: "2 بيض مخفوق مع بقدونس وبصل", cal: 240, tags: ["gluten_free", "vegetarian"] },
            { name_ar: "مكدوس", desc_ar: "2 حبة مكدوس + ربع رغيف + شاي", cal: 350, tags: ["gluten", "nuts", "vegan"] },
            { name_ar: "جبنة بيضاء", desc_ar: "3 شرائح جبنة نابلسية (منقوعة) + خيار", cal: 260, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "سلطة بطاطا", desc_ar: "حبة بطاطا مسلوقة + بقدونس وليمون", cal: 200, tags: ["vegan", "gluten_free"] }
        ],
        lunch: [
            { name_ar: "مجدرة", desc_ar: "6 ملاعق مجدرة (برغل أو رز) + سلطة", cal: 500, tags: ["vegan", "gluten_free"] },
            { name_ar: "شيش طاووق", desc_ar: "2 سيخ (200غ) + نصف رغيف + ثومية", cal: 450, tags: ["gluten", "high-protein"] },
            { name_ar: "منسف (لايت)", desc_ar: "150غ لحم بدون دهن + 6 ملاعق رز + جميد", cal: 650, tags: ["lactose", "gluten_free", "high-protein"] },
            { name_ar: "بامية ورز", desc_ar: "1 كوب بامية مطبوخة + 5 ملاعق رز", cal: 400, tags: ["gluten_free"] },
            { name_ar: "صيادية سمك", desc_ar: "فيليه سمك (200غ) + 6 ملاعق رز صيادية", cal: 550, tags: ["gluten_free", "high-protein", "pescatarian"] },
            { name_ar: "كفتة بالطحينة", desc_ar: "2 قطعة كفتة + 3 ملاعق صوص طحينة", cal: 600, tags: ["gluten_free", "high-protein"] },
            { name_ar: "مقلوبة دجاج", desc_ar: "قطعة صدر دجاج + 6 ملاعق رز + باذنجان", cal: 580, tags: ["gluten_free", "high-protein"] },
            { name_ar: "فاصوليا خضراء", desc_ar: "1 كوب يخنة + 90غ لحم عجل + رز", cal: 420, tags: ["gluten_free"] },
            { name_ar: "مسخن رول", desc_ar: "2 رول دجاج (خبز شراك) + لبن", cal: 500, tags: ["gluten", "high-protein"] },
            { name_ar: "كبة لبنية", desc_ar: "3 حبات كبة + 1 كوب لبن مطبوخ", cal: 550, tags: ["gluten", "lactose"] },
            { name_ar: "ملوخية ودجاج", desc_ar: "1 كوب ملوخية + 5 ملاعق رز + دجاج", cal: 450, tags: ["gluten_free", "high-protein"] },
            { name_ar: "ورق عنب", desc_ar: "10 حبات (يلنجي) + سلطة زبادي", cal: 350, tags: ["vegan", "gluten_free"] },
            { name_ar: "دجاج محشي", desc_ar: "نصف صدر دجاج محشي فريك (3 ملاعق)", cal: 550, tags: ["gluten", "high-protein"] },
            { name_ar: "سمك مشوي", desc_ar: "سمكة كاملة (300غ) + سلطة جرجير", cal: 400, tags: ["gluten_free", "high-protein", "pescatarian"] },
            { name_ar: "يخنة بطاطا", desc_ar: "1 كوب يخنة بطاطا ولحم + 5 ملاعق رز", cal: 500, tags: ["gluten_free"] },
            { name_ar: "بازيلاء وجزر", desc_ar: "1 كوب يخنة + 90غ لحم مفروم + رز", cal: 420, tags: ["gluten_free"] },
            { name_ar: "كباب مشوي", desc_ar: "3 أسياخ كباب (200غ) + سلطة مشوية", cal: 550, tags: ["gluten_free", "high-protein"] },
            { name_ar: "شاورما صحن", desc_ar: "200غ شاورما (بدون خبز) + سلطة", cal: 450, tags: ["gluten_free", "high-protein"] },
            { name_ar: "معكرونة بولونيز", desc_ar: "1 كوب معكرونة مسلوقة + لحم مفروم", cal: 550, tags: ["gluten"] },
            { name_ar: "فاهيتا دجاج", desc_ar: "200غ دجاج + فليفلة وبصل (بدون خبز)", cal: 400, tags: ["gluten_free", "high-protein"] },
            { name_ar: "عدس بحامض", desc_ar: "1.5 كوب عدس وسلق + ليمون", cal: 350, tags: ["vegan", "gluten_free"] },
            { name_ar: "ستيك لحم", desc_ar: "شريحة ستيك (150غ) + خضار سوتيه", cal: 500, tags: ["gluten_free", "high-protein"] },
            { name_ar: "كبسة دجاج", desc_ar: "قطعة دجاج + 6 ملاعق رز بسمتي", cal: 600, tags: ["gluten_free", "high-protein"] },
            { name_ar: "كشري", desc_ar: "1 كوب كشري + صلصة طماطم", cal: 550, tags: ["vegan", "gluten"] },
            { name_ar: "صينية خضار", desc_ar: "خضار مشكلة بالفرن + صدر دجاج", cal: 400, tags: ["gluten_free", "high-protein"] }
        ],
        dinner: [
            { name_ar: "شوربة عدس", desc_ar: "1.5 كوب (350مل) + ليمون", cal: 290, tags: ["vegan", "gluten_free"] },
            { name_ar: "سلطة حلوم", desc_ar: "3 شرائح حلوم + 2 كوب خضار", cal: 320, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "تونا بالماء", desc_ar: "علبة صغيرة (ماء) + نصف كوب ذرة", cal: 250, tags: ["gluten_free", "high-protein", "pescatarian"] },
            { name_ar: "متبل باذنجان", desc_ar: "4 ملاعق متبل + نصف رغيف صغير", cal: 280, tags: ["vegan", "gluten"] },
            { name_ar: "زبادي وخيار", desc_ar: "علبة زبادي (170غ) + 2 خيار", cal: 180, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "سلطة يونانية", desc_ar: "خضار + 30غ جبنة فيتا + زيتون", cal: 220, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "أومليت فطر", desc_ar: "2 بيضة + نصف كوب فطر", cal: 240, tags: ["gluten_free", "vegetarian"] },
            { name_ar: "فتوش", desc_ar: "صحن كبير + ربع رغيف محمص", cal: 200, tags: ["gluten", "vegan"] },
            { name_ar: "صدر دجاج", desc_ar: "150غ مشوي + سلطة خضراء", cal: 300, tags: ["gluten_free", "high-protein"] },
            { name_ar: "فول باللبن", desc_ar: "1 كوب فول + 2 ملعقة طحينة ولبن", cal: 310, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "سلطة سيزر", desc_ar: "100غ دجاج + خس + صوص خفيف", cal: 350, tags: ["gluten_free", "high-protein"] },
            { name_ar: "شوربة خضار", desc_ar: "2 كوب خضار مسلوقة (بدون دهن)", cal: 150, tags: ["vegan", "gluten_free"] },
            { name_ar: "توست تونا", desc_ar: "1 توست أسمر + نصف علبة تونا", cal: 280, tags: ["gluten", "pescatarian"] },
            { name_ar: "جبنة قريش", desc_ar: "1 كوب (200غ) + طماطم", cal: 200, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "سلطة كينوا", desc_ar: "6 ملاعق كينوا + بقدونس ورمان", cal: 280, tags: ["vegan", "gluten_free"] },
            { name_ar: "سلطة جرجير", desc_ar: "جرجير + بصل + سماق (بدون زيت)", cal: 100, tags: ["vegan", "gluten_free"] },
            { name_ar: "لبنة وخضار", desc_ar: "3 ملاعق لبنة + خيار وجزر", cal: 180, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "شوربة شوفان", desc_ar: "1 كوب شوربة شوفان ودجاج", cal: 250, tags: ["gluten", "high-protein"] },
            { name_ar: "بطاطا مشوية", desc_ar: "حبة متوسطة + ملعقة لبنة", cal: 200, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "سلطة تونا", desc_ar: "نصف علبة تونا + فاصوليا حمراء", cal: 250, tags: ["gluten_free", "high-protein"] }
        ],
        snacks: [
            { name_ar: "تمر وجوز", desc_ar: "3 حبات تمر + 3 أنصاف جوز", cal: 190, tags: ["nuts", "vegan", "sugar", "gluten_free"] },
            { name_ar: "فواكه", desc_ar: "تفاحة متوسطة أو كوب فراولة", cal: 100, tags: ["vegan", "sugar", "gluten_free"] },
            { name_ar: "حمص محمص", desc_ar: "نصف كوب حمص بالفرن", cal: 150, tags: ["vegan", "gluten_free"] },
            { name_ar: "شوكولاتة داكنة", desc_ar: "مكعبين (20غ) 70% كاكاو", cal: 110, tags: ["sugar", "vegan", "gluten_free"] },
            { name_ar: "لوز ني", desc_ar: "15 حبة لوز غير مملح", cal: 170, tags: ["nuts", "vegan", "gluten_free"] },
            { name_ar: "فشار", desc_ar: "3 أكواب (بدون زيت)", cal: 100, tags: ["vegan", "gluten_free"] },
            { name_ar: "ترمس", desc_ar: "1 كوب ترمس مسلوق", cal: 110, tags: ["vegan", "gluten_free"] },
            { name_ar: "لبن عيران", desc_ar: "1 كوب (250مل)", cal: 90, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "تفاح وزبدة", desc_ar: "1 تفاحة + 1 ملعقة زبدة فول", cal: 200, tags: ["nuts", "vegan", "sugar", "gluten_free"] },
            { name_ar: "كعك أرز", desc_ar: "2 قطعة + شريحة جبنة", cal: 140, tags: ["lactose", "gluten_free", "vegetarian"] },
            { name_ar: "خيار وجزر", desc_ar: "2 خيار + 2 جزر مقطع", cal: 60, tags: ["vegan", "gluten_free"] },
            { name_ar: "كاجو ني", desc_ar: "10 حبات كاجو", cal: 160, tags: ["nuts", "vegan", "gluten_free"] },
            { name_ar: "بسكويت شوفان", desc_ar: "2 قطعة (دايجستف لايت)", cal: 150, tags: ["gluten", "sugar", "vegetarian"] },
            { name_ar: "موزة", desc_ar: "حبة متوسطة", cal: 100, tags: ["vegan", "sugar", "gluten_free"] },
            { name_ar: "عصير برتقال", desc_ar: "كوب طازج (بدون سكر)", cal: 110, tags: ["vegan", "sugar", "gluten_free"] },
            { name_ar: "بذور يقطين", desc_ar: "2 ملعقة طعام", cal: 120, tags: ["vegan", "gluten_free"] },
            { name_ar: "زبادي فواكه", desc_ar: "علبة صغيرة خالية الدسم", cal: 140, tags: ["lactose", "sugar", "gluten_free"] },
            { name_ar: "سحلب", desc_ar: "نصف كوب (حليب خالي الدسم)", cal: 150, tags: ["lactose", "sugar"] },
            { name_ar: "مهلبيبة", desc_ar: "نصف كوب (سكر خفيف)", cal: 180, tags: ["lactose", "sugar", "gluten_free"] },
            { name_ar: "بوظة عربية", desc_ar: "كرة واحدة (بدون فستق)", cal: 200, tags: ["lactose", "sugar", "gluten_free"] } // Removed nuts tag if pistachios omitted
        ]
    }
};

// 2. CHATBOT (Bilingual)
app.post("/api/chat", async (req, res) => {
    try {
        const { messages, lang } = req.body;
        const systemMsg = lang === 'ar' 
            ? "أنت دكتور أوليف، خبير تغذية. جاوب دائماً باللغة العربية."
            : "You are Dr. Olive, a nutrition expert. Always answer in English.";
            
        if(messages.length === 0 || messages[0].role !== "system") {
            messages.unshift({ role: "system", content: systemMsg });
        } else {
            messages[0].content = systemMsg;
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: messages, 
        });
        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ reply: "Error: Check .env file." });
    }
});

// 3. HEALTH CALCULATIONS (Auto Ideal Weight)
app.post("/api/calculate", (req, res) => {
    const { weight, height, age, gender, bf, activity, goal } = req.body;
    let bmr;
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (bf && bf > 0) {
        bmr = 370 + (21.6 * (w * (1 - (bf / 100))));
    } else {
        bmr = (gender === 'male') 
            ? (10 * w) + (6.25 * h) - (5 * age) + 5 
            : (10 * w) + (6.25 * h) - (5 * age) - 161;
    }

    let tdee = bmr * parseFloat(activity);
    if (goal === 'cut') tdee -= 500;
    if (goal === 'bulk') tdee += 300;

    const heightM = h / 100;
    const bmi = (w / (heightM * heightM)).toFixed(1);
    
    // Status Logic
    let status_en = "Normal";
    let status_ar = "وزن طبيعي";
    if (bmi < 18.5) { status_en = "Underweight"; status_ar = "نحافة"; }
    else if (bmi >= 25 && bmi < 30) { status_en = "Overweight"; status_ar = "زيادة وزن"; }
    else if (bmi >= 30) { status_en = "Obese"; status_ar = "سمنة"; }

    // Perfect Weight Calculation (BMI 22)
    const perfectW = (22 * (heightM * heightM)).toFixed(1);
    
    // Difference (To Ideal)
    const diff = (w - perfectW).toFixed(1);

    const macros = {
        p: Math.round(w * 2.0),
        f: Math.round((tdee * 0.25) / 9),
        c: Math.round((tdee - (w * 2.0 * 4) - (tdee * 0.25)) / 4)
    };

    res.json({ 
        cals: Math.round(tdee), 
        macros, 
        bmi, 
        bmr: Math.round(bmr),
        status_en,
        status_ar,
        perfectW,
        diff
    });
});

// 4. MEAL REGENERATOR (Strict Filters)
app.post("/api/regen-meal", (req, res) => {
    const { type, allergies, diseases } = req.body; 
    const options = mealDB["middle eastern"][type] || mealDB["middle eastern"]["lunch"];
    
    const algs = Array.isArray(allergies) ? allergies : [];
    const dis = Array.isArray(diseases) ? diseases : [];

    let safeOptions = options.filter(meal => {
        const mTags = meal.tags || [];
        
        // Strict Checks
        if (algs.includes('nuts') && mTags.includes('nuts')) return false;
        if (algs.includes('gluten') && mTags.includes('gluten')) return false;
        if (algs.includes('lactose') && mTags.includes('lactose')) return false;
        
        // Disease Checks
        if (dis.includes('diabetes') && mTags.includes('sugar')) return false;

        return true;
    });

    if (safeOptions.length === 0) {
        // Fallback: Return a very safe default if everything is filtered
        safeOptions = [{ name_ar: "خيار وجزر", desc_ar: "خضار مقطعة (آمن)", cal: 50 }]; 
    }

    res.json(safeOptions[Math.floor(Math.random() * safeOptions.length)]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Nutri-AI active on port ${PORT}`));