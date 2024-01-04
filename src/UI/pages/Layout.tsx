// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import {useImmerReducer} from "use-immer";
import {Outlet} from "react-router-dom";
import {JSX} from "react";
import {initialState, reducer, StateContext} from "../../store/store.ts";
import Header from "../components/Header/Header.tsx";


function Layout({children}:{children?:JSX.Element|JSX.Element[]}) {
    const [state,dispatch]= useImmerReducer(reducer, initialState)

    return (
        <>
            <StateContext.Provider value={{state:state, dispatch:dispatch}}>
                <Header
                    title={'Test Vite + React + TypeScript'}
                    subTitle={'scss + cypress'}
                    themeColor='is-info'
                    tabs={['Users','NewUser','TestSuspense','ZodValidation']}
                />
                <main className='container is-fluid mt-4'>
                    {children?? <Outlet />}
                </main>
            </StateContext.Provider>
        </>
    )
}

export default Layout
