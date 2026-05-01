# Guia Completo de Comandos Git

## 1. Configuração Inicial

### git config
Define configurações globais do Git no sistema.

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

**Exemplo prático:**
```bash
# Configurar nome de usuário
git config --global user.name "Marlon Silva"

# Configurar email
git config --global user.email "marlon@email.com"

# Ver configurações
git config --list
```

---

## 2. Criar e Clonar Repositórios

### git init
Inicializa um novo repositório Git em um diretório existente.

```bash
git init
```

**Exemplo prático:**
```bash
# Criar nova pasta e inicializar
mkdir meu-projeto
cd meu-projeto
git init

# Resultado: Criado repositório vazio em .git/
```

### git clone
Cria uma cópia completa de um repositório remoto.

```bash
git clone <url>
```

**Exemplo prático:**
```bash
# Clonar repositório público
git clone https://github.com/facebook/react.git

# Clonar com nome personalizado
git clone https://github.com/facebook/react.git meu-react

# Clonar branch específico
git clone -b develop https://github.com/user/repo.git
```

---

## 3. Status e Histórico

### git status
Mostra o estado atual do repositório (arquivos modificados, staged, etc).

```bash
git status
```

**Exemplo prático:**
```bash
# Estado limpo (nada pendente)
$ git status
On branch main
nothing to commit, working tree clean

# Estado com alterações
$ git status
On branch main
Untracked files:
  (use "git add <file>..." to include in what will be committed)
    novo-arquivo.txt

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
    modified:   src/app.ts
```

### git log
Exibe o histórico de commits do repositório.

```bash
git log
```

**Exemplo prático:**
```bash
# Histórico completo
$ git log
commit a1b2c3d4e5f6...
Author: Marlon Silva <marlon@email.com>
Date:   Wed Apr 30 10:30:2026
    Adiciona autenticação

commit b2c3d4e5f6a7...
Author: Marlon Silva <marlon@email.com>
Date:   Tue Apr 29 15:20:2026
    Corrige bug no login

# Histórico resumido (uma linha)
$ git log --oneline
a1b2c3d Adiciona autenticação
b2c3d4e Corrige bug no login
c3d4e5f Initial commit

# Ver últimos 3 commits
$ git log -3 --oneline

# Histórico com gráfico
$ git log --graph --oneline --all
```

### git diff
Mostra as diferenças entre arquivos, commits ou branches.

```bash
git diff
```

**Exemplo prático:**
```bash
# Ver alterações não staged (trabalho atual)
$ git diff
- const oldValue = "antigo";
+ const newValue = "novo";

# Ver alterações staged
$ git diff --staged

# Ver diferença entre dois commits
$ git diff a1b2c3d..b2c3d4e

# Ver diferença de um arquivo específico
$ git diff src/app.ts

# Ver diferença entre branches
$ git diff main..feature/login
```

---

## 4. Adicionar e Commitar

### git add
Adiciona arquivos ao staging area (pré-commit).

```bash
git add <arquivo>
git add .
git add -A
```

**Exemplo prático:**
```bash
# Adicionar um arquivo específico
git add src/controllers/auth.ts

# Adicionar todos os arquivos modificados
git add .

# Adicionar todos (novos, modificados e deletados)
git add -A

# Adicionar todos arquivos .ts
git add *.ts

# Adicionar por padrão (interactive)
git add -p
```

### git commit
Salva as alterações staged no histórico do repositório.

```bash
git commit -m "mensagem"
```

**Exemplo prático:**
```bash
# Commit simples
git commit -m "Adiciona controller de autenticação"

# Commit com descrição detalhada
git commit -m "Título do commit" -m "Descrição mais detalhada..."

# Adicionar e commitar em um comando
git commit -am "Mensagem"  # ⚠️ apenas para arquivos já rastreados

# Commit amend (alterar último commit)
git commit --amend -m "Mensagem corrigida"
```

---

## 5. Branches

### git branch
Gerencia branches (criar, listar, deletar).

```bash
git branch
git branch <nome>
git branch -d <nome>
```

**Exemplo prático:**
```bash
# Listar todas as branches locais
$ git branch
* main
  develop
  feature/login

# Listar branches remotas
$ git branch -r
  origin/main
  origin/develop

# Listar todas (locais e remotas)
$ git branch -a

# Criar nova branch
git branch feature/cadastro

# Criar branch a partir de um commit específico
git branch hotfix/v1.0.1 a1b2c3d

# Deletar branch (protegido)
git branch -d feature/cadastro

# Deletar branch (forçado)
git branch -D feature/cadastro

# Renomear branch
git branch -m old-name new-name
```

### git checkout / git switch
Troca entre branches ou restaura arquivos.

```bash
git checkout <branch>
git checkout -b <branch>
git switch <branch>
git switch -c <branch>
```

**Exemplo prático:**
```bash
# Trocar para branch existente
git checkout develop
git switch develop

# Criar e trocar para nova branch
git checkout -b feature/nova-funcionalidade
git switch -c feature/nova-funcionalidade

# Criar branch a partir de outra branch específica
git checkout -b feature/login develop

# Restaurar arquivo do último commit
git checkout -- src/app.ts

# Restaurar arquivo de uma branch específica
git checkout main -- src/app.ts

# Criar branch órfã (sem histórico)
git checkout --orphan nova-branch
```

### git merge
Mescla uma branch na branch atual.

```bash
git merge <branch>
```

**Exemplo prático:**
```bash
# Estar na main e mesclar feature
git checkout main
git merge feature/login

# Mesclar com mensagem customizada
git merge feature/login -m "Merge da feature de login"

# Mesclar sem fast-forward (sempre cria commit de merge)
git merge --no-ff feature/login

# Abortar merge em conflito
git merge --abort
```

### git rebase
Aplica commits sobre outra base (reescreve histórico).

```bash
git rebase <branch>
```

**Exemplo prático:**
```bash
# Rebasar feature na main
git checkout feature/login
git rebase main

# Rebasar interativo (reescrever histórico)
git rebase -i HEAD~3

# Continuar após resolver conflitos
git rebase --continue

# Abortar rebase
git rebase --abort
```

---

## 6. Sincronização Remota

### git remote
Gerencia repositórios remotos.

```bash
git remote -v
git remote add <nome> <url>
git remote remove <nome>
```

**Exemplo prático:**
```bash
# Ver remotes configurados
$ git remote -v
origin  https://github.com/user/repo.git (fetch)
origin  https://github.com/user/repo.git (push)

# Adicionar novo remote
git remote add upstream https://github.com/original/repo.git

# Renomear remote
git remote rename origin old-origin

# Remover remote
git remote remove upstream
```

### git fetch
Baixa objetos e referências do remote sem mesclar.

```bash
git fetch
git fetch origin
```

**Exemplo prático:**
```bash
# Buscar todas as branches remotas
git fetch origin

# Buscar todas as branches de todos os remotes
git fetch --all
```

### git pull
Baixa e mescla alterações do remote.

```bash
git pull
git pull origin main
```

**Exemplo prático:**
```bash
# Pull padrão (buscar + mesclar)
git pull

# Pull com rebase (evita merge commit)
git pull --rebase origin main

# Pull de branch específica
git pull origin feature/login
```

### git push
Envia commits locais para o remote.

```bash
git push
git push origin <branch>
```

**Exemplo prático:**
```bash
# Push padrão
git push

# Push para branch específica
git push origin feature/login

# Push e configurar upstream
git push -u origin feature/login

# Push para todas as branches
git push --all origin

# Forçar push (⚠️ usar com cuidado)
git push --force origin feature/login

# Deletar branch remota
git push origin --delete feature/velha
```

---

## 7. Operações Avançadas

### git stash
Salva alterações temporariamente sem commit.

```bash
git stash
git stash pop
git stash list
```

**Exemplo prático:**
```bash
# Salvar alterações atuais
$ git stash
Saved working directory and index state WIP on main: a1b2c3d

# Listar stashes
$ git stash list
stash@{0}: WIP on main: a1b2c3d mensagem
stash@{1}: WIP on main: b2c3d4e outra mensagem

# Restaurar último stash
git stash pop

# Aplicar stash específico
git stash apply stash@{0}

# Criar branch a partir de stash
git stash branch nova-branch stash@{0}

# Limpar stashes
git stash clear
```

### git reset
Desfaz commits (move o ponteiro HEAD).

```bash
git reset --soft HEAD~1
git reset --hard HEAD~1
```

**Exemplo prático:**
```bash
# Desfazer commit (manter arquivos no staging)
git reset --soft HEAD~1

# Desfazer commit (manter arquivos como modificados)
git reset HEAD~1
# ou
git reset --mixed HEAD~1

# Desfazer commit (perder todas as alterações)
git reset --hard HEAD~1

# Desfazer commits específicos
git reset a1b2c3d

# Remover arquivo do staging
git reset src/app.ts
```

### git revert
Cria um novo commit que desfaz outro commit.

```bash
git revert <commit>
```

**Exemplo prático:**
```bash
# Reverter último commit
git revert HEAD

# Reverter commit específico
git revert a1b2c3d

# Reverter sem confirmar (editar manualmente)
git revert -n a1b2c3d
```

### git cherry-pick
Aplica commits específicos de outra branch.

```bash
git cherry-pick <commit>
```

**Exemplo prático:**
```bash
# Aplicar um commit específico
git cherry-pick a1b2c3d

# Aplicar múltiplos commits
git cherry-pick a1b2c3d b2c3d4e c3d4e5f

# Aplicar sem confirmar
git cherry-pick -n a1b2c3d
```

---

## 8. Visualização e Informação

### git show
Mostra detalhes de um commit, tag ou objeto.

```bash
git show <commit>
```

**Exemplo prático:**
```bash
# Ver último commit
$ git show
commit a1b2c3d
Author: Marlon Silva <marlon@email.com>
Date:   Wed Apr 30 10:30:2026

    Adiciona autenticação

diff --git a/src/auth.ts b/src/auth.ts
...

# Ver commit específico
git show a1b2c3d

# Ver tag
git show v1.0.0
```

### git blame
Mostra quem editou cada linha de um arquivo.

```bash
git blame <arquivo>
```

**Exemplo prático:**
```bash
# Ver responsáveis por cada linha
$ git blame src/auth.ts
a1b2c3d (Marlon Silva 2026-04-30 10:30) const auth = true;
b2c3d4e (João Silva 2026-04-29 15:20) function login() {
c3d4e5f (Maria Silva 2026-04-28 09:10) // TODO: adicionar validação

# Ver blame de linhas específicas
git blame -L 10,20 src/auth.ts
```

### git reflog
Mostra histórico de todas as operações (inclusive resets).

```bash
git reflog
```

**Exemplo prático:**
```bash
# Ver histórico completo
$ git reflog
a1b2c3d HEAD@{0}: commit: Mensagem
b2c3d4e HEAD@{1}: checkout: moving from main to develop
c3d4e5f HEAD@{2}: commit: Outro commit

# Restaurar estado anterior
git checkout HEAD@{2}
```

---

## 9. Comandos Úteis do Dia a Dia

### Atalhos Úteis
```bash
# Status curto
git status -s

# Ver branches com último commit
git branch -v

# Ver branches já mescladas
git branch --merged

# Ver branches não mescladas
git branch --no-merged

# Ver arquivos não rastreados
git ls-files --others --exclude-standard
```

### Limpeza
```bash
# Remover branches já mescladas
git branch --merged | grep -v "\*" | xargs git branch -d

# Limpar referências remotas obsoletas
git remote prune origin
```

### aliases (atalhos)
```bash
# Criar atalhos
git config --global alias.s status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status -s
git config --global alias.lg log --oneline --graph --all
```

---

## Fluxo de Trabalho Típico

```bash
# 1. Clonar repositório
git clone https://github.com/user/repo.git
cd repo

# 2. Criar branch de feature
git checkout -b feature/nova-funcionalidade

# 3. Trabalhar... adicionar arquivos
git add .
git commit -m "Adiciona feature X"

# 4. Sincronizar com main
git fetch origin
git rebase origin/main

# 5. Enviar para remote
git push -u origin feature/nova-funcionalidade

# 6. Após review, mesclar
git checkout main
git merge feature/nova-funcionalidade
git push origin main
```

---

## Referência Rápida

| Comando | Descrição |
|---------|-----------|
| `git init` | Inicializar repositório |
| `git clone <url>` | Clonar repositório |
| `git status` | Ver estado |
| `git add .` | Adicionar tudo |
| `git commit -m "msg"` | Criar commit |
| `git push` | Enviar para remote |
| `git pull` | Baixar do remote |
| `git branch` | Listar/criar branches |
| `git checkout` | Trocar branch |
| `git merge` | Mesclar branches |
| `git stash` | Salvar temporariamente |
| `git log` | Ver histórico |
| `git diff` | Ver diferenças |