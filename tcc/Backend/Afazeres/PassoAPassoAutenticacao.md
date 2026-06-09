# Passo a passo da autenticacao

1. Ler a visao geral do sistema antes de mexer em qualquer rota ligada a usuarios, pacientes, agendas, horarios e agendamentos.
2. Manter `POST /api/auth/login` publico, porque ele e a porta de entrada do JWT.
3. Garantir que o token carregue `id_usuario` e `perfil`, e que o middleware de autenticacao exponha esses dados no `req.user`.
4. Proteger rotas administrativas com `authMiddleware` + `authorize("ADMIN")`.
5. Liberar apenas o fluxo de cadastro inicial de usuario/paciente quando fizer sentido para o login do paciente.
6. Validar o fluxo do paciente em agendamento e cancelamento, porque ele depende do perfil logado e do vinculo com o paciente cadastrado.
7. Revisar os controllers que ainda usam `req.user.role` ou esperam campos diferentes do JWT para nao quebrar a autorizacao.
8. Conferir os testes e os retornos de erro depois de cada grupo de rota alterado.