<template>
    <div class="system-d-information">
        <v-click>
            <span class="service jeunes">
                <span class="users">Jeune 🧒</span>
                <span class="plateforme">
                    App
                    <logos-apple-app-store />
                    <devicon-android />
                    💻
                </span>
                <span class="stack" v-click="6">
                    <span class="langage">
                        <devicon-typescript />
                    </span>
                    <span class="framework">
                        <logos-react />
                    </span>
                </span>
            </span>
        </v-click>
        <v-click>
            <span class="service acteurs-culturel">
                <span class="users">Acteur culturel 📚📽️🧑‍🎨🧑‍🎤</span>
                <span class="plateforme">Plateforme web 🖥️</span>
                <span class="stack" v-click="6">
                    <span class="langage">
                        <devicon-typescript />
                    </span>
                    <span class="framework">
                        <logos-react />
                    </span>
                </span>
            </span>
        </v-click>
        <v-click>
            <span class="service prof">
                <span class="users">Prof 🧑‍🏫</span>
                <span class="plateforme">Plateforme web 🖥️</span>
                <span class="stack" v-click="6">
                    <span class="langage">
                        <devicon-typescript />
                    </span>
                    <span class="framework">
                        <logos-react />
                    </span>
                </span>
            </span>
        </v-click>
        <v-click>
            <span class="service interne">
                <span class="users">Interne 🧑‍💼</span>
                <span class="plateforme">Backoffice 💻</span>
                    <span class="stack" v-click="6">
                        <span class="langage">
                            <logos-python />
                        </span>
                        <span class="framework">
                            <bxl-flask />
                        </span>
                    </span>
            </span>
        </v-click>
        <v-click>
            <span class="monolith">
                <span class="service backend">
                    <span class="users">Monolith</span>
                    <span class="plateforme">API</span>
                    <span class="stack" v-click="6">
                        <span class="langage">
                            <logos-python />
                        </span>
                        <span class="framework">
                            <bxl-flask />
                        </span>
                    </span>
                </span>
                <hr class="arrow horizontal arrow-right" />
                <hr class="arrow horizontal arrow-left" />
                <hr class="arrow vertical arrow-up" />
                <hr class="arrow vertical arrow-down" />

                <span class="arrow arrow-right">➡️</span>
                <span class="arrow arrow-left">⬅️</span>
                <span class="arrow arrow-up">⬆️</span>
                <span class="arrow arrow-down">⬇️</span>
            </span>
        </v-click>
    </div>
</template>

<style scoped>
.system-d-information {
    width: 100%;
    height: 100%;

    display: grid;
    grid-template-areas:
        ". prof ."
        "jeunes monolith acteurs-culturel"
        ". interne ."
    ;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(3, 1fr);

    align-items: center;
    justify-items: stretch;

    .jeunes {
        grid-area: jeunes;
    }

    .acteurs-culturel {
        grid-area: acteurs-culturel;
    }

    .prof {
        grid-area: prof;
    }

    .interne {
        grid-area: interne;
    }

    .monolith {
        place-self: stretch;

        grid-area: monolith;
        display: grid;
        grid-template-areas:
            ". arrow-down ."
            "arrow-right backend arrow-left"
            ". arrow-up ."
        ;
        grid-template-rows: repeat(3, 1fr);
        grid-template-columns: repeat(3, 1fr);

        place-items: center;

        .backend {
            grid-area: backend;
        }

        .arrow {
            display: block;
            height: auto;
            border-width: 0;

            &.horizontal {
                justify-self: stretch;
                border-bottom-width: 0.1em;
            }

            &.vertical {
                align-self: stretch;
                border-left-width: 0.1em;
            }
        }

        .arrow-right {
            grid-area: arrow-right;
        }

        .arrow-left {
            grid-area: arrow-left;
        }

        .arrow-up {
            grid-area: arrow-up;
        }

        .arrow-down {
            grid-area: arrow-down;
        }
    }

    .service {
        display: grid;
        grid-template-areas:
            "qui qui"
            "plateforme stack"
        ;
        grid-template-rows: repeat(2, 1fr);
        grid-template-columns: repeat(2, 1fr);

        place-items: center;
        text-align: center;

        .users {
            grid-area: qui;
        }

        .plateforme {
            grid-area: plateforme;
        }

        .stack {
            grid-area: stack;
        }
    }
}
</style>

