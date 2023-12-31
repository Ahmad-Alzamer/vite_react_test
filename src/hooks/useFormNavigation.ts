import {FormDef} from "../UI/components/DynamicForm/types.ts";
import {useState} from "react";

export interface UseFormNavigationResult {
    currentPage: string,
    hasPrevious: boolean,
    hasNext: boolean,
    numberOfPages: number,
    currentPageNumber: string,
    nextPage: () => void,
    previousPage: () => void,
    firstPage: () => void,
    lastPage: () => void
}
export default  function useFormNavigation(formDef: FormDef): UseFormNavigationResult{
    const [pageNavStatus,setPageNavStatus] = useState({
        currentPage : formDef.pages[0].id,
        numberOfPages: formDef.pages.length,
        hasPrevious: false,
        hasNext: formDef.pages.length>1,
        currentPageNumber: 0
    });

    function firstPage(){
        setPageNavStatus({
            currentPage : formDef.pages[0].id,
            numberOfPages: formDef.pages.length,
            hasPrevious: false,
            hasNext: formDef.pages.length>1,
            currentPageNumber: 0
        });
    }
    function nextPage(){
        if(pageNavStatus.hasNext){
            setPageNavStatus({
                currentPage : formDef.pages[pageNavStatus.currentPageNumber+1].id,
                numberOfPages: formDef.pages.length,
                hasPrevious: formDef.pages.length>1,
                hasNext: pageNavStatus.currentPageNumber < pageNavStatus.numberOfPages-2,
                currentPageNumber: pageNavStatus.currentPageNumber+1
            });
        }
    }
    function previousPage(){
        if(pageNavStatus.hasPrevious){
            setPageNavStatus({
                currentPage : formDef.pages[pageNavStatus.currentPageNumber-1].id,
                numberOfPages: formDef.pages.length,
                hasPrevious: pageNavStatus.currentPageNumber>1,
                hasNext: formDef.pages.length>1,
                currentPageNumber: pageNavStatus.currentPageNumber-1
            });
        }
    }
    function lastPage(){
        setPageNavStatus({
            currentPage : formDef.pages[formDef.pages.length-1].id,
            numberOfPages: formDef.pages.length,
            hasPrevious: formDef.pages.length>1,
            hasNext: false,
            currentPageNumber: formDef.pages.length-1
        });
    }
    return {
        currentPage : pageNavStatus.currentPage,
        hasPrevious : pageNavStatus.hasPrevious,
        hasNext: pageNavStatus.hasNext,
        numberOfPages: pageNavStatus.numberOfPages,
        currentPageNumber: pageNavStatus.currentPage + 1,
        nextPage,
        previousPage,
        firstPage,
        lastPage
    };

}