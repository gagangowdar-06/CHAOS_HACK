(function(){
  // Keyword map: English + Hindi/Kannada/Tamil/Telugu/Marathi/Bengali (native script and romanised).
  // Demo-level matching; a real build would use an NLP/LLM backend plus clinician-reviewed content.
  const SYMPTOMS = {
    irregular: {label:"Irregular or missed periods", pcos:true,
      kw:["irregular period","periods late","missed period","no period","period delay","delayed period","cycle","irregular","माहवारी","पीरियड","मासिक","अनियमित","ಮುಟ್ಟು","ಋತುಚಕ್ರ","மாதவிடாய்","முறையற்ற","నెలసరి","పీరియడ్స్","मासिक पाळी","पाळी","মাসিক","পিরিয়ড","mahwari","masik","muttu","maadhavidai","nelasari"]},
    acne: {label:"Acne or oily skin", pcos:true,
      kw:["acne","pimple","oily skin","breakout","मुंहासे","मुहासे","पिंपल","ಮೊಡವೆ","முகப்பரு","మొటిమలు","पुरळ","ব্রণ","modave","muhase","mugapparu","motimalu"]},
    hirsutism: {label:"Extra facial or body hair", pcos:true,
      kw:["facial hair","hair on face","chin hair","excess hair","unwanted hair","hirsut","चेहरे पर बाल","अनचाहे बाल","ಮುಖದ ಮೇಲೆ ಕೂದಲು","முகத்தில் முடி","ముఖంపై వెంట్రుకలు","चेहऱ्यावर केस","মুখে লোম","অতিরিক্ত লোম"]},
    hairloss: {label:"Hair thinning or hair loss", pcos:true,
      kw:["hair loss","hair fall","hair thinning","thinning hair","balding","बाल झड़","बाल गिर","ಕೂದಲು ಉದುರ","முடி உதிர","జుట్టు రాలు","केस गळ","চুল পড়","baal jhad","kudalu udur","mudi uthir"]},
    weight: {label:"Weight gain or trouble losing weight", pcos:true,
      kw:["weight gain","gaining weight","belly fat","can't lose weight","cannot lose weight","वजन बढ़","मोटापा","ತೂಕ ಹೆಚ್ಚ","எடை அதிக","బరువు పెరు","वजन वाढ","ওজন বাড়","vajan badh","thooka"]},
    skin: {label:"Dark, velvety skin patches", pcos:true,
      kw:["dark patch","darkening","dark neck","acanthosis","velvety","गर्दन काली","काले धब्बे","ಕತ್ತು ಕಪ್ಪು","கழுத்து கருப்பு","మెడ నల్ల","मान काळी","ঘাড় কালো"]},
    fatigue: {label:"Tiredness", pcos:false,
      kw:["tired","fatigue","exhausted","no energy","low energy","थकान","थकावट","ಆಯಾಸ","ಸುಸ್ತು","சோர்வு","అలసట","थकवा","ক্লান্তি","thakan","sustu"]},
    mood: {label:"Mood changes or low mood", pcos:false,
      kw:["mood","anxious","anxiety","depressed","sad","irritable","चिड़चिड़","उदास","ಮನಸ್ಥಿತಿ","ಬೇಸರ","மனநிலை","மன அழுத்தம்","మూడ్","ఆందోళన","मूड","चिडचिड","মেজাজ","মন খারাপ"]},
    pain: {label:"Pelvic or period pain", pcos:false,
      kw:["pelvic pain","cramp","period pain","lower abdomen","पेट दर्द","पेट में दर्द","ಹೊಟ್ಟೆ ನೋವು","வயிற்று வலி","కడుపు నొప్పి","पोट दुखत","পেট ব্যথা"]}
  };
  const URGENT = ["fainting","fainted","soaking","very heavy bleeding","heavy bleeding","severe pain","unbearable","pregnant","chest pain","can't breathe","बेहोश","बहुत ज्यादा खून","तेज दर्द","ಮೂರ್ಛೆ","ತೀವ್ರ ನೋವು","மயக்கம்","கடுமையான வலி","స్పృహ తప్పి","తీవ్రమైన నొప్పి","बेशुद्ध","তীব্র ব্যথা","অজ্ঞান"];

  const $ = id => document.getElementById(id);
  const box = $("symptoms"), out = $("result");

  document.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => {
    box.value = (box.value.trim() ? box.value.trim() + ", " : "") + c.textContent.toLowerCase();
    box.focus();
  }));

  function analyse(text){
    const t = text.toLowerCase();
    const hits = Object.keys(SYMPTOMS).filter(k => SYMPTOMS[k].kw.some(w => t.includes(w.toLowerCase())));
    const urgent = URGENT.some(w => t.includes(w.toLowerCase()));
    return {hits, urgent};
  }

  function render(r){
    const pcosHits = r.hits.filter(k => SYMPTOMS[k].pcos);
    let h = "";
    if(r.urgent){
      h += '<div class="card urgent"><h3>This may need care today</h3><p>Some of what you wrote can be a warning sign. Please see a doctor or go to the nearest emergency department now. Do not wait for more information from this page.</p></div>';
    }
    if(!r.hits.length && !r.urgent){
      h += '<div class="card"><h3>I could not pick out a symptom</h3><p>Try adding how long it has lasted and what changed, for example “periods every 50 days for 6 months”. You can also tap a quick-add button above.</p></div>';
    } else if(r.hits.length){
      h += '<div class="card"><h3>What I noticed</h3><div class="found">' + r.hits.map(k => "<b>" + SYMPTOMS[k].label + "</b>").join("") + "</div></div>";
      if(pcosHits.length >= 2 && pcosHits.some(k => k === "irregular")){
        h += '<div class="card"><h3>What this can point to</h3><p>Irregular periods together with skin, hair or weight changes are a pattern doctors often check for <strong>PCOS</strong>. Thyroid conditions and other hormone issues can look similar, so this is not a diagnosis.</p></div>';
      } else if(pcosHits.length){
        h += '<div class="card"><h3>What this can point to</h3><p>These symptoms have several possible causes, including hormonal ones such as PCOS or thyroid changes. One or two symptoms alone say little. A doctor can look at the full picture.</p></div>';
      } else {
        h += '<div class="card"><h3>What this can point to</h3><p>These symptoms are common and have many causes, such as stress, sleep, iron levels or hormones. Tracking them helps a doctor.</p></div>';
      }
      h += '<div class="card"><h3>Suggested next steps</h3><ul>' +
        '<li>Book a visit with a <strong>gynaecologist</strong> (an endocrinologist or dermatologist can also help).</li>' +
        '<li>Note your period dates for the last 3–6 months and when each symptom began.</li>' +
        (pcosHits.length ? '<li>Ask whether blood tests (hormones, thyroid, blood sugar) or a pelvic ultrasound are right for you.</li>' : '') +
        '<li>Seek urgent care for very heavy bleeding, severe pain or fainting.</li></ul></div>';
    }
    h += '<p style="font-size:.85rem;color:var(--muted);margin:12px 0 0">General information only. Not a diagnosis or medical advice.</p>';
    out.innerHTML = h;
    out.scrollIntoView({behavior:"smooth", block:"nearest"});
  }

  $("go").addEventListener("click", () => {
    const text = box.value.trim();
    if(!text){ out.innerHTML = '<div class="card warn"><h3>Add a few words first</h3><p>Write or speak what you are feeling, then try again.</p></div>'; box.focus(); return; }
    render(analyse(text));
  });

  // Voice input (Chrome/Edge/Safari). Hidden if unsupported.
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const mic = $("mic");
  if(!SR){ mic.style.display = "none"; }
  else {
    let rec = null, on = false;
    mic.addEventListener("click", () => {
      if(on){ rec && rec.stop(); return; }
      rec = new SR(); rec.lang = $("lang").value; rec.interimResults = false;
      rec.onresult = e => { box.value = (box.value.trim() + " " + e.results[0][0].transcript).trim(); };
      rec.onend = () => { on = false; mic.setAttribute("aria-pressed","false"); mic.textContent = "🎤 Speak"; };
      rec.onerror = () => { out.innerHTML = '<div class="card warn"><p>Voice input did not work. Please type your symptoms instead.</p></div>'; };
      rec.start(); on = true; mic.setAttribute("aria-pressed","true"); mic.textContent = "⏹ Stop";
    });
  }
})();
