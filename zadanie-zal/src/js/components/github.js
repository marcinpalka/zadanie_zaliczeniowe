export class GithubSearch {
    $rootContainer = document.querySelector('.root');
    $input = document.querySelector('input');
    $showButton = document.querySelector('.show-btn');
    $clearButton = document.querySelector('.clear-btn');
    githubAdress = 'https://api.github.com/users';
    

    eventListeners() {
        this.$showButton.addEventListener('click', () => {
            const inputValue = this.$input.value;
            if(inputValue === '') return;
            this.getData(inputValue);
        });

        this.$clearButton.addEventListener('click', () => {
            this.clear();
        });
    }

    async fetchUserData(userName) {
        return await fetch(`${this.githubAdress}/${userName}`)
            .then(response => response.json())
            .then(response => response);
    }

    async fetchRepos(url) {
        return await fetch(url)
            .then(response => response.json())
            .then(response => response);
    }

    async getData(userName) {
        const userData = await this.fetchUserData(userName);
        const reposData = await this.fetchRepos(userData.repos_url);

        this.$input.value = '';

        this.printUserData(userData);
        this.printRepos(reposData);
    }

    printUserData(userData) {
        let $userAvatar = document.createElement('img');
        let $userName = document.createElement('h2');
        let $repoHeader = document.createElement('h4');

        $userAvatar.setAttribute('src', userData.avatar_url);
        $userAvatar.style.width = '50px';

        $userName.append(`Nazwa: ${userData.login}`);
        $repoHeader.innerText = "Repozytoria:";

        this.$rootContainer.prepend($userAvatar);
        $userAvatar.after($userName);
        $userName.after($repoHeader);
    }

    printRepos(reposData) {
        const $list = document.createElement('ul');
        this.$rootContainer.append($list);

        reposData.map((repo) => {
            let $linkItem = document.createElement('a');
            let $listItem = document.createElement('li');

            $linkItem.setAttribute('href', repo.html_url);
            $linkItem.setAttribute('target', '_blank');
            $linkItem.innerText = repo.name;
            $listItem.append($linkItem);

            $list.append($listItem);
        })
    }

    clear() {
        this.$rootContainer.innerHTML = '';
    }

    async init() {
        this.eventListeners();
    }
}