<script setup lang="ts">
import { scale, solidBgColor } from '../../services/stylingHelper';
import BackIcon from '../../assets/svg/arrow_left_curved.svg';
import ForwardIcon from '../../assets/svg/arrow_right_curved.svg';
import UpIcon from '../../assets/svg/double_arrow_up.svg';
import ArrowUpIcon from '../../assets/svg/triangle_up.svg';
import ArrowDownIcon from '../../assets/svg/triangle_down.svg'
import { ref } from 'vue';
import { Settings } from '../../models/settings';

const sortingMode = ref<"a-z" | "z-a" | "lastModified" | "firstModified" | "biggest" | "smallest">("a-z");

</script>

<template>
    <div class="container">
        <div class="overlay"></div>

        <div class="frame">
            <div v-focus-section class="top-bar">
                <div class="group">
                    <div v-focus class="icon-holder focusable-br7 sfx-nav-handler sfx-activation-handler">
                        <BackIcon class="icon" />
                    </div>
                    <div v-focus class="icon-holder focusable-br7 sfx-nav-handler sfx-activation-handler">
                        <ForwardIcon class="icon" />
                    </div>
                </div>
                <div class="group">
                    <div v-focus class="icon-holder focusable-br7 sfx-nav-handler sfx-activation-handler">
                        <UpIcon class="icon" />
                    </div>
                    <h1>Path text</h1>
                </div>
            </div>

            <div class="main-content-container">
                <div class="quick-places"></div>
                <div class="files">
                    <div v-focus-section class="sorting-bar">
                        <div v-focus class="group sfx-nav-handler sfx-activation-handler">
                            <h2>Name</h2>
                            <ArrowUpIcon v-if="sortingMode == 'a-z'" class="icon" />
                            <ArrowDownIcon v-if="sortingMode == 'z-a'" class="icon" />
                        </div>
                        <div v-focus class="group  sfx-nav-handler sfx-activation-handler">
                            <h2>Modified</h2>
                            <ArrowUpIcon v-if="sortingMode == 'firstModified'" class="icon" />
                            <ArrowDownIcon v-if="sortingMode == 'lastModified'" class="icon" />
                        </div>
                        <div v-focus class="group  sfx-nav-handler sfx-activation-handler">
                            <h2>Size</h2>
                            <ArrowUpIcon v-if="sortingMode == 'smallest'" class="icon" />
                            <ArrowDownIcon v-if="sortingMode == 'biggest'" class="icon" />
                        </div>
                    </div>

                    <div class="items-container"></div>
                </div>
            </div>

            <div v-focus-section class="buttons-container">
                <div v-focus class="button focusable-br7 sfx-nav-handler sfx-activation-handler pulse-handler">
                    <h2>
                        Select
                    </h2>
                </div>
                <div v-focus class="button focusable-br7 sfx-nav-handler sfx-activation-handler pulse-handler">
                    <h2>
                        Cancel
                    </h2>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    z-index: 1000;
}

.overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
}

.frame {
    width: 80%;
    aspect-ratio: 16 / 9;
    background-color: v-bind(solidBgColor);
    border-radius: 7px;

    box-sizing: border-box;
    padding: v-bind(scale(20));

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    flex-direction: column;
}

.icon-holder {
    width: v-bind(scale(40));
    height: v-bind(scale(40));
    color: white;
}

.icon {
    width: v-bind(scale(40));
    height: v-bind(scale(40));
    color: white;

    box-sizing: border-box;
    padding: v-bind(scale(2));
}

.top-bar {
    display: flex;
    align-items: center;
    margin-bottom: v-bind(scale(10));
    gap: v-bind(scale(50));

    flex-shrink: 0;

    height: v-bind(scale(65));

    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 7px;

    padding: 0 v-bind(scale(40));

    & .group {
        display: flex;
        align-items: center;
        gap: v-bind(scale(25));
    }
}

.main-content-container {
    width: 100%;
    height: 100%;
    display: flex;

    flex: 1;

    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 7px;

    & .quick-places {
        height: 100%;
        width: 30%;

        border-right: 1px solid rgba(255, 255, 255, 0.25);
        border-radius: 7px 0 0 7px;
    }

    & .files {
        width: 100%;
        height: 100%;

        & .sorting-bar {
            height: v-bind(scale(45));
            display: flex;
            align-items: center;

            & .group {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: v-bind(scale(5));

                flex: 1;
                height: 100%;

                background-color: #38373A;

                & .icon {
                    padding: v-bind(scale(5));
                }

                &:focus {
                    background-color: v-bind('Settings.get("accent_color")');
                }

                &:last-child {
                    border-radius: 0 7px 0 0;
                }
            }
        }
    }
}

.buttons-container {
    height: v-bind(scale(70));
    width: 100%;

    display: flex;
    justify-content: end;
    align-items: end;
    gap: v-bind(scale(25));

    flex-shrink: 0;

    & .button {
        width: v-bind(scale(200));
        height: v-bind(scale(50));
        background-color: #38373A;
        border-radius: 7px;

        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>