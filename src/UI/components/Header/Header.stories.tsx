import type { Meta, StoryObj } from '@storybook/react';

import Header from './Header.tsx';
import '../../../App.scss';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Components/Header',
    component: Header,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
        // docs: {inlineStories: false, iframeHeight: 600 },

    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        // https://storybook.js.org/docs/essentials/controls
        themeColor: {
            options: ['is-primary' , 'is-dark' , 'is-danger' , 'is-warning' ,'is-link' , 'is-info' , 'is-success' , 'is-text'],
            control: { type: 'select' },
        },
    },
    // decorators:[
    //     withRouter
    // ]
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const IsInfo: Story = {
    name:'is-info',
    parameters:{

    },
    args: {
        title: 'My Header',
        subTitle: 'My Subheader',
        tabs: ['tab 1', 'tab 2', 'tab 3'],
        links:['link 1', 'link 2','link 3'],
        themeColor: 'is-info'
    },
};


export const IsPrimary: Story = {
    name:'is-primary',
    parameters:{

    },
    args: {
        title: 'My Header',
        subTitle: 'My Subheader',
        tabs: ['tab 1', 'tab 2', 'tab 3'],
        links:['link 1', 'link 2','link 3'],
        themeColor: 'is-primary'
    },
};

export const IsDark: Story = {
    name:'is-dark',
    parameters:{

    },
    args: {
        title: 'My Header',
        subTitle: 'My Subheader',
        tabs: ['tab 1', 'tab 2', 'tab 3'],
        links:['link 1', 'link 2','link 3'],
        themeColor: 'is-dark'
    },
};
