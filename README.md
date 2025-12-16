# Portfólio — Base

Esta é uma base simples para um portfólio pessoal.

Como usar

- Abrir `index.html` no navegador (duplo clique ou via `start index.html` no PowerShell).
- Atualizar os textos na seção `Sobre`, os cards em `Projetos` e os links.
- Substituir as miniaturas por imagens reais e apontar os links para repositórios/versões hospedadas.

Deploy rápido

- GitHub Pages: criar repositório e enviar os arquivos (branch `main`), então ativar Pages nas configurações.
- Netlify/Vercel: arrastar e soltar a pasta, ou conectar ao repositório Git.

Netlify Forms (integração rápida)

- Os formulários de contato e newsletter já estão preparados para o Netlify Forms.
- Para usar: faça deploy do projeto no Netlify (conecte ao repositório ou arraste a pasta).
- O Netlify detectará os formulários com `data-netlify="true"`. Você poderá visualizar envios no painel "Forms" do site no Netlify.
- Para testar localmente, o envio por fetch será interceptado pelo navegador, mas os envios só serão processados após o deploy. O handler JS fornece feedback visual imediato.

Exemplo de comportamento

- `contatos.html` contém um formulário nomeado `contact` e usará Netlify Forms quando o site estiver hospedado no Netlify.
- O rodapé contém um formulário `newsletter` que também submete para Netlify.

Se quiser, posso integrar em vez disso EmailJS (envio direto para seu e-mail via serviço de cliente) — me diga qual prefere.

Próximos passos sugeridos

- Adicionar um formulário real usando EmailJS ou um endpoint de backend.
- Incluir páginas separadas para cada projeto ou carregar dados dinamicamente.
- Melhorar SEO e adicionar metatags og/twitter.
