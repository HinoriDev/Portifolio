// Insere o ano atual no rodapé
document.addEventListener('DOMContentLoaded', function(){
  const y = new Date().getFullYear();
  const el = document.getElementById('year');
  if(el) el.textContent = y;

  // Smooth scroll para âncoras
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href.length>1){
        e.preventDefault();
        const target = document.querySelector(href);
        if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
      }
    })
  })

  // Toggle do menu mobile
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if(toggle && links){
    toggle.addEventListener('click', ()=>{
      links.style.display = (links.style.display==='flex')? 'none' : 'flex';
      links.style.flexDirection = 'column';
    })
  }

  // Handler simples do formulário
  const form = document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const data = new FormData(form);

      // If EmailJS is configured, use it first
      if(window.EMAILJS_CONFIG && window.EMAILJS_CONFIG.serviceId &&
         window.EMAILJS_CONFIG.templateId && window.EMAILJS_CONFIG.publicKey &&
         window.EMAILJS_CONFIG.serviceId !== 'your_service_id'){

        if(window.emailjs && typeof emailjs.send === 'function'){
          const params = {
            from_name: data.get('name') || '',
            from_email: data.get('email') || '',
            message: data.get('message') || ''
          };
          emailjs.send(window.EMAILJS_CONFIG.serviceId, window.EMAILJS_CONFIG.templateId, params)
            .then(()=>{ showToast('Mensagem enviada! Obrigado, entrarei em contato em breve.','success'); form.reset(); })
            .catch(err=>{
              console.error('EmailJS send failed', err);
              // fallback to Netlify then mailto
              submitViaNetlifyOrMailto(data, form);
            });
          return;
        } else {
          console.warn('EmailJS SDK not loaded, falling back.');
        }
      }

      // default: try Netlify then mailto fallback
      submitViaNetlifyOrMailto(data, form);
    })
  }

  // helper: try Netlify post, fallback to mailto
  function submitViaNetlifyOrMailto(formData, formEl){
    if(!formData.get('form-name')) formData.append('form-name', formEl.getAttribute('name') || 'contact');
    fetch('/', {
      method:'POST',
      body: new URLSearchParams(formData),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(res=>{
      showToast('Mensagem enviada! Obrigado, entrarei em contato em breve.','success');
      formEl.reset();
    }).catch(err=>{
      console.error('Netlify submit failed', err);
      showToast('Não foi possível enviar automaticamente — abrindo seu cliente de e-mail.','error');
      // mailto fallback
      const name = formEl.querySelector('input[name="name"]')?.value || '';
      const email = formEl.querySelector('input[name="email"]')?.value || '';
      const message = formEl.querySelector('textarea[name="message"]')?.value || '';
      const to = 'gui-benetti@hotmail.com';
      const subject = encodeURIComponent('Contato pelo site — ' + name + ' <' + email + '>');
      const body = encodeURIComponent(message + '\n\n--\nEnviado via formulário de contato');
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    })
  }

  // Toast helper
  function showToast(message, type='info', timeout=4200){
    let container = document.querySelector('.toast-container');
    if(!container){ container = document.createElement('div'); container.className='toast-container'; document.body.appendChild(container); }
    const t = document.createElement('div'); t.className = 'toast '+type; t.setAttribute('role','status'); t.setAttribute('aria-live','polite'); t.innerHTML = `<div class="msg">${message}</div>`;
    // trigger entry animation
    requestAnimationFrame(()=> t.classList.add('show'));
    container.appendChild(t);
    setTimeout(()=>{ t.style.opacity=0; t.style.transform='translateX(20px)'; setTimeout(()=> t.remove(), 420); }, timeout);
  }

  // Projects: filter buttons
  const catBtns = document.querySelectorAll('.cat-btn');
  const projectCards = document.querySelectorAll('.project-card');
  catBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      catBtns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      projectCards.forEach(card=>{
        if(cat==='all' || card.dataset.category===cat){
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      })
    })
  })

  // Project modal: open when clicking a card
  const projectsGrid = document.getElementById('projects-grid');
  function openModal(data){
    const modal = document.createElement('div');
    modal.className = 'proj-modal';
    modal.innerHTML = `
      <div class="modal-card">
        <button class="modal-close" aria-label="Fechar">✕</button>
        <div class="modal-media" style="background-image:url('${data.img}')"></div>
        <div class="modal-body">
          <h3>${data.title}</h3>
          <p>${data.desc}</p>
          <p style="margin-top:12px;font-size:14px;color:#555"><strong>Tecnologias:</strong> ${data.tags.join(', ')}</p>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector('.modal-close').addEventListener('click', ()=> modal.remove());
    modal.addEventListener('click', (e)=>{ if(e.target===modal) modal.remove(); })
  }

  // --- Projects carousel ---
  const projectsData = {
    'portal-receitas': {
      title: 'Portal de Receitas',
      slides: [
        {
          header: 'Visão Geral do Projeto',
          subtitle: '1 de 5',
          content: `<h3>Portal de Receitas</h3>
            <p>O Portal de Receitas é uma plataforma inovadora que conecta clientes e fornecedores de forma rápida e prática. O projeto foi desenvolvido com foco em usabilidade e experiência do usuário.</p>
            <div style="margin-top:14px;padding:16px;border-radius:10px;background:#f5f8fa;border:1px solid rgba(0,0,0,0.04)">
              <strong>Objetivos do Projeto</strong>
              <ul style="margin-top:8px;color:#334155">
                <li>Facilitar a navegação e descoberta de receitas culinárias</li>
                <li>Conectar culinaristas profissionais com apreciadores de gastronomia</li>
                <li>Proporcionar uma experiência responsiva em todos os dispositivos</li>
                <li>Implementar sistema de cadastro e gerenciamento eficiente</li>
              </ul>
            </div>
            <div style="display:flex;gap:12px;margin-top:14px">
              <div style="padding:12px;border-radius:8px;background:#fff;border:1px solid rgba(0,0,0,0.04);flex:1"><strong>Stack</strong><div>HTML, CSS e Javascript</div></div>
              <div style="padding:12px;border-radius:8px;background:#fff;border:1px solid rgba(0,0,0,0.04);flex:1"><strong>Banco de Dados</strong><div>MySQL</div></div>
              <div style="padding:12px;border-radius:8px;background:#fff;border:1px solid rgba(0,0,0,0.04);flex:1"><strong>Status</strong><div style="color:#d97706">Em Desenvolvimento</div></div>
            </div>`
        },
        {
          header: 'Andamento do Projeto',
          subtitle: '2 de 5',
          content: `<h3>Status de Desenvolvimento</h3>
            <p>O projeto está em desenvolvimento ativo, com diferentes frentes de trabalho progredindo simultaneamente. Abaixo um exemplo do painel de progresso por área.</p>
            <img src="Imagens/Portal de Receitas/progresso.png" alt="andamento" style="width:100%;border-radius:8px;margin-top:12px"/>`
        },
        {
          header: 'Prévia das Interfaces',
          subtitle: '3 de 5',
          content: `<h3>Principais Telas do Sistema</h3>
            <p>Conheça as principais interfaces desenvolvidas para o Portal de Receitas.</p>
            <img src="Imagens/Portal de Receitas/principal.png" alt="ui" style="width:100%;border-radius:8px;margin-top:12px"/>`
        },
        {
          header: 'Prévia das Interfaces',
          subtitle: '4 de 5',
          content: `<h3>Área do Culinarista</h3>
            <p>A página do culinarista foi projetada para ser um espaço profissional e atraente, permitindo apresentar trabalhos e gerenciar receitas.</p>
            <img src="Imagens/Portal de Receitas/secundario.jpg" alt="andamento" style="width:100%;border-radius:8px;margin-top:12px"/>`
        },
        {
          header: 'Equipe de Desenvolvimento',
          subtitle: '5 de 5',
          content: `
            <h3>Colaboradores envolventes no projeto</h3>
            <p>Conheça a equipe responsável pelo desenvolvimento.</p>
            <div class="team-grid">
              <div class="team-card">
                <div class="avatar">EM</div>
                <h5>André Nonaka</h5>
                <a class="portfolio-link" href="https://nonakaandre-oss.github.io/Portfolio/" target="_blank" rel="noopener noreferrer">Ver Portfólio</a>
              </div>
              <div class="team-card">
                <div class="avatar">GO</div>
                <h5>Eduardo Martino</h5>
                <a class="portfolio-link" href="#">Ver Portfólio</a>
              </div>
              <div class="team-card">
                <div class="avatar">GH</div>
                <h5>Gustavo Oliveira</h5>
                <a class="portfolio-link" href="#">Ver Portfólio</a>
              </div>
              <div class="team-card">
                <div class="avatar">LP</div>
                <h5>Luiz Paulo</h5>
                <a class="portfolio-link" href="https://neno300.github.io/Portfolio/" target="_blank" rel="noopener noreferrer">Ver Portfólio</a>
              </div>
            </div>`
        }
      ]
    },
    // --- Hackthon Inova-Saúde 1°Edição ---
    'Acolhe-Saúde': {
      title: 'Acolhe-Saúde',
      slides: [
        {
          header: 'Visão Geral do Projeto',
          subtitle: '1 de 6',
          content: `<h3>Acolhe-Saúde — Hackthon Inova-Saúde (1ª Edição)</h3>
            <p>Projeto desenvolvido durante a maratona Hackthon Inova-Saúde com foco em facilitar o acolhimento e encaminhamento de pacientes em redes de atenção primária.</p>
            <div style="margin-top:14px;padding:16px;border-radius:10px;background:#f5f8fa;border:1px solid rgba(0,0,0,0.04)">
              <strong>Objetivos</strong>
              <ul style="margin-top:8px;color:#334155">
                <li>Mapear fluxos de atendimento e oferecer triagem inicial digital</li>
                <li>Conectar pacientes e profissionais de saúde de forma ágil</li>
                <li>Propor soluções simples e escaláveis para unidades de atenção básica</li>
              </ul>
            </div>
              <div style="display:flex;gap:12px;margin-top:14px">
              <div style="padding:12px;border-radius:8px;background:#fff;border:1px solid rgba(0,0,0,0.04);flex:1"><strong>Stack</strong><div>Frond-end e Back-end</div></div>
              <div style="padding:12px;border-radius:8px;background:#fff;border:1px solid rgba(0,0,0,0.04);flex:1"><strong>Banco de Dados</strong><div></div></div>
              <div style="padding:12px;border-radius:8px;background:#fff;border:1px solid rgba(0,0,0,0.04);flex:1"><strong>Status</strong><div style="color:#d97706">Em Aguado da proposta para desenvolver</div></div>
            </div>`
        },
        {
          header: 'Prototipação & UI',
          subtitle: '2 de 8',
          content: `<h3>O problema</h3>
            <p>Escolhemos o problema de atendimento ao paciente em rede de saúde.</p>
            <img src="Imagens/Hackthon 1°edição/problema.png" alt="capa" style="width:100%;border-radius:8px;margin-top:12px"/>`
        },
        {
          header: 'Relução de Problema',
          subtitle: '3 de 8',
          content: `<h3>Protótipos e Telas</h3>
            <p>Discutimos a criação de telas e fluxos pensados durante o hackthon.</p>
            <img src="Imagens/Hackthon 1°edição/o_portal.png" alt="capa" style="width:100%;border-radius:8px;margin-top:12px"/>`
        },
        {
          header: 'Prototipação & UI',
          subtitle: '4 de 8',
          content: `<h3>Protótipos e Telas</h3>
            <p>Exemplos da criação de telas e fluxos pensados durante o hackthon.</p>
            <img src="Imagens/Hackthon 1°edição/portal.png" alt="capa" style="width:100%;border-radius:8px;margin-top:12px"/>`
        },
        {
          header: 'Orientação de Medicamentos',
          subtitle: '5 de 8',
          content: `<h3>Guia Medicamento</h3>
            <p>Orientação sobre o uso de medicamentos.</p>
            <img src="Imagens/Hackthon 1°edição/guia.png" alt="fluxo" style="width:100%;border-radius:8px;margin-top:12px"/>`
        },
        {
          header: 'Guia Medica',
          subtitle: '6 de 8',
          content: `<h3>Demonstração</h3>
            <p>Orientação sobre o preparo para realizar o exame medico.</p>
            <img src="Imagens/Hackthon 1°edição/guia_de_exame.png" alt="demo" style="width:100%;border-radius:8px;margin-top:12px"/>`
        },
        {
          header: 'Videos Explicativos',
          subtitle: '7 de 8',
          content: `<h3>Vídeos de profissionais da área da saúde</h3>
            <p>Apresentação de video explicativos da area da saúde de profissionais.</p>
            <img src="Imagens/Hackthon 1°edição/video_medico.png" alt="demo" style="width:100%;border-radius:8px;margin-top:12px"/>`
        },
        {
          header: 'Equipe',
          subtitle: '8 de 8',
          content: `<h3>Equipe do Hackthon</h3>
            <p>Colaboradores e papéis principais durante a edição.</p>
            <img src="Imagens/Hackthon 1°edição/grupos.png" alt="demo" style="width:100%;border-radius:8px;margin-top:12px"/>`
        }
      ]
    }
  };

  function openStepsModal(projectId){
    const data = projectsData[projectId];
    if(!data) return;
    let idx = 0;
    const modal = document.createElement('div'); modal.className='proj-steps-modal';
    modal.innerHTML = `
      <div class="steps-card">
        <div class="steps-header">
          <div class="title">${data.slides[0].header} <small style="opacity:0.9;margin-left:10px;font-weight:400">${data.slides[0].subtitle}</small></div>
          <div style="display:flex;gap:10px;align-items:center"><button class="steps-close">✕</button></div>
        </div>
        <div class="steps-content">${data.slides[0].content}</div>
        <div class="steps-footer">
          <div class="steps-indicators">${data.slides.map((s,i)=>`<span class="dot ${i===0? 'active':''}" data-index="${i}"></span>`).join('')}</div>
          <div class="steps-controls">
            <button class="btn-prev">Anterior</button>
            <button class="btn-next">Próximo</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);

    const headerTitle = modal.querySelector('.steps-header .title');
    const contentEl = modal.querySelector('.steps-content');
    const dots = Array.from(modal.querySelectorAll('.steps-indicators .dot'));
    const btnPrev = modal.querySelector('.btn-prev');
    const btnNext = modal.querySelector('.btn-next');
    const btnClose = modal.querySelector('.steps-close');

    function update(){
      const s = data.slides[idx];
      headerTitle.innerHTML = `${s.header} <small style="opacity:0.9;margin-left:10px;font-weight:400">${s.subtitle}</small>`;
      contentEl.innerHTML = s.content;
      dots.forEach((d,i)=> d.classList.toggle('active', i===idx));
      // update buttons
      btnPrev.disabled = idx===0;
      btnNext.textContent = (idx===data.slides.length-1)? 'Fechar' : 'Próximo';
    }

    btnPrev.addEventListener('click', ()=>{ if(idx>0){ idx--; update(); contentEl.scrollTop=0; } });
    btnNext.addEventListener('click', ()=>{ if(idx < data.slides.length-1){ idx++; update(); contentEl.scrollTop=0; } else { modal.remove(); } });
    btnClose.addEventListener('click', ()=> modal.remove());
    modal.addEventListener('click', (e)=>{ if(e.target===modal) modal.remove(); });
  }

  // wire up project details buttons
  document.querySelectorAll('.project-details').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const id = btn.dataset.project;
      if(id) openStepsModal(id);
    })
  })

  // Generic handler for Netlify forms in footer (newsletter and others)
  document.querySelectorAll('form[data-netlify]').forEach(f=>{
    // skip contact-form handled above (it also has data-netlify)
    if(f.id==='contact-form') return;
    f.addEventListener('submit', function(e){
      e.preventDefault();
      const fd = new FormData(f);
      // Ensure form-name is present (Netlify requires it)
      if(!fd.get('form-name')){
        fd.append('form-name', f.getAttribute('name') || 'form');
      }
      fetch('/', {method:'POST', body: new URLSearchParams(fd)}).then(()=>{
        // simple inline success feedback
        const btn = f.querySelector('button');
        const original = btn.textContent;
        btn.textContent = 'Enviado ✓';
        btn.disabled = true;
        setTimeout(()=>{ btn.textContent = original; btn.disabled=false; f.reset(); }, 2500);
      }).catch(err=>{
        console.error(err);
        showToast('Não foi possível enviar o formulário agora. Tente novamente mais tarde.','error');
      })
    })
  })

  // Skills: dynamic render + admin (localStorage)
  // Skills are rendered statically in `index.html` so edit them directly in that file.

  // Animate pill progress bars when they enter viewport
  const pillEls = document.querySelectorAll('.pill-fill');
  if(pillEls.length){
    const obs = new IntersectionObserver((entries, observer)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const el = entry.target;
          const pct = el.dataset.percent || '0';
          // set width to trigger CSS transition
          requestAnimationFrame(()=>{ el.style.width = pct + '%'; });
          observer.unobserve(el);
        }
      })
    }, {threshold: 0.25});
    pillEls.forEach(p=>{ p.style.width = '0'; obs.observe(p); });
  }
});
