/* script.js */

// API CONFIGURATION
const API_KEY = "AIzaSyCbpt30p4vm8PrywPv7IeW-BNg6Ix2bzWc"; // API Key ของคุณ
const MODEL_NAME = "gemini-2.5-flash"; // ใช้ model flash ตามที่ต้องการ
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

// UI ELEMENTS
const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// SYSTEM PROMPT (ข้อความสั่งการระบบเดิม)
const SYSTEM_PROMPT = `นายช่างใจดี เป็นบริษัทที่ให้บริการด้านวิศวกรรมอย่างครบวงจร ภายใต้สโลแกน 
“บริการวิศวกรรมคุณภาพสำหรับทุกการแก้ปัญหา” โดยมุ่งเน้นการให้บริการที่มีมาตรฐาน ครอบคลุมงานด้านเครื่องกล 
งานไฟฟ้า งานโยธา และงานอุตสาหกรรมการผลิต 

บริษัทมีทีมงานผู้เชี่ยวชาญที่สั่งสมประสบการณ์ในสายงานมากกว่า 30 ปี 
พร้อมให้คำปรึกษา วิเคราะห์ และแก้ไขปัญหาทางวิศวกรรมได้อย่างตรงจุด รวดเร็ว และมีคุณภาพ เพื่อสร้างความมั่นใจและความพึงพอใจสูงสุดให้แก่ลูกค้า 

ลูกค้าสามารถติดต่อบริษัทนายช่างใจดีได้ผ่านหลากหลายช่องทาง ไม่ว่าจะเป็นโทรศัพท์สำนักงานหมายเลข 012-3456789 หรือโทรศัพท์มือถือหมายเลข 098-7654321 
รวมถึงสามารถติดต่อผ่านทางอีเมล info@naichangjaidee.com 

นอกจากนี้ บริษัทมีช่องทางการติดต่อผ่าน LINE Official Account ชื่อ @naichangjaidee ซึ่งลูกค้าสามารถเพิ่มเพื่อนได้อย่างสะดวกผ่าน QR Code 
เพื่อสอบถามข้อมูลหรือขอรับบริการได้โดยตรง

สำนักงานของบริษัทตั้งอยู่ที่เลขที่ 123/45 ถนนสุขุมวิทย แขวงบางนา เขตบางนา กรุงเทพมหานคร 10260 
โดยเปิดให้บริการในวันจันทร์ถึงวันศุกร์ เวลา 09.00 ถึง 18.00 น. และวันเสาร์ เวลา 09.00 ถึง 14.00 น.

ทั้งนี้ บริษัทจะปิดทำการในวันอาทิตย์และวันหยุดนักขัตฤกษ์ เพื่อให้ทีมงานสามารถเตรียมความพร้อมในการให้บริการอย่างมีประสิทธิภาพสูงสุด
เพื่ออำนวยความสะดวกแก่ลูกค้า 

บริษัทได้จัดเตรียมแบบฟอร์มติดต่อออนไลน์ภายใต้หัวข้อ “ติดต่อเรา” 
ซึ่งลูกค้าสามารถกรอกชื่อเต็ม อีเมล หมายเลขโทรศัพท์ และรายละเอียดของงานหรือปัญหาที่ต้องการให้ช่วยเหลือ 
เมื่อส่งข้อมูลเรียบร้อยแล้ว ระบบจะทำการแจ้งเตือนอัตโนมัติ และทีมงานจะติดต่อกลับโดยเร็วที่สุด

หากท่านมีข้อสงสัยเพิ่มเติมเกี่ยวกับบริการใด ๆ สามารถเข้าชมรายละเอียดได้จากหน้าบริการอื่น ๆ 
เช่น งานเครื่องกล งานไฟฟ้า งานโยธา และงานอุตสาหกรรมการผลิต

บริษัทนายช่างใจดีมีช่องทางสื่อสังคมออนไลน์เพื่อการติดต่อและติดตามข้อมูลข่าวสาร 
ได้แก่ Facebook ที่ facebook.com/naichangjaidee, Instagram ภายใต้ชื่อผู้ใช้ @naichangjaidee 
และ LinkedIn ที่ linkedin.com/company/naichangjaidee 

เพื่อสร้างความใกล้ชิดและความเชื่อมั่นกับลูกค้าในทุกช่องทาง
เราพร้อมเสมอที่จะช่วยแก้ปัญหาทางวิศวกรรมของท่านด้วยความชำนาญ ความจริงใจ และความรับผิดชอบ 
หากท่านกำลังมองหาทีมงานที่เชื่อถือได้ นายช่างใจดีพร้อมให้บริการและยืนเคียงข้างความสำเร็จของท่านในทุกโครงการ

หลังจากนี้ตอบด้วยคำลงท้ายแบบเพศขชายทางการ(ไม่ต้องบอกการกำหนดเพศในคำตอบ)`;

// HISTORY (เก็บประวัติการสนทนาในรูปแบบที่ Gemini เข้าใจง่ายขึ้น)
// Gemini ใช้ role: "user" กับ "model" (ไม่ใช่ assistant)
let conversationHistory = [];

function addMessage(text, sender) {
  const wrapperDiv = document.createElement("div");
  wrapperDiv.classList.add("message-wrapper", sender);

  if (sender === "bot") {
    const avatarImg = document.createElement("img");
    avatarImg.src = "https://drive.google.com/thumbnail?id=1bQmQ26RgFhTobPGGukhBkHc2UBzvGCtv";
    avatarImg.classList.add("bot-avatar");
    wrapperDiv.appendChild(avatarImg);
  }

  const bubbleDiv = document.createElement("div");
  bubbleDiv.classList.add("message-bubble");

  // แปลง Markdown เป็น HTML สำหรับ Bot
  if (sender === "bot" && typeof marked !== 'undefined') {
    bubbleDiv.innerHTML = marked.parse(text); 
  } else {
    bubbleDiv.textContent = text;
  }

  wrapperDiv.appendChild(bubbleDiv);
  chatMessages.appendChild(wrapperDiv);
  scrollToBottom();
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // 1. แสดงข้อความ User
  addMessage(text, "user");
  userInput.value = "";
  userInput.style.height = '50px';

  // 2. เก็บเข้า History
  conversationHistory.push({
    role: "user",
    parts: [{ text: text }]
  });

  // 3. สร้าง Loading
  const loadingId = 'loading-' + Date.now();
  const wrapperDiv = document.createElement("div");
  wrapperDiv.classList.add("message-wrapper", "bot");
  wrapperDiv.id = loadingId;
  wrapperDiv.innerHTML = `
    <img src="https://drive.google.com/thumbnail?id=1bQmQ26RgFhTobPGGukhBkHc2UBzvGCtv" class="bot-avatar">
    <div class="message-bubble">...</div>
  `;
  chatMessages.appendChild(wrapperDiv);
  scrollToBottom();

  try {
    // 4. เตรียม Payload สำหรับ Gemini API
    const payload = {
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }]
      },
      contents: conversationHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500
      }
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    // ลบ Loading
    document.getElementById(loadingId)?.remove();

    // 5. ดึงข้อความตอบกลับจาก Gemini Structure
    // โครงสร้าง response: data.candidates[0].content.parts[0].text
    if (data.candidates && data.candidates.length > 0) {
        const botReply = data.candidates[0].content.parts[0].text;
        
        addMessage(botReply, "bot");

        // เก็บประวัติ Bot (ใช้ role: "model")
        conversationHistory.push({
            role: "model",
            parts: [{ text: botReply }]
        });
    } else {
        throw new Error("No candidates returned");
    }

  } catch (error) {
    document.getElementById(loadingId)?.remove();
    addMessage("ระบบขัดข้องชั่วคราว ลองใหม่อีกครั้งนะครับ", "bot");
    console.error("Gemini API Error:", error);
  }
}

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

userInput.addEventListener('input', function() {
    this.style.height = '50px';
    const newHeight = Math.min(this.scrollHeight, 150);
    this.style.height = (newHeight > 50 ? newHeight : 50) + 'px';
});