import {delay, http, HttpResponse} from "msw";
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
export const handlers = [
    http.get(
        '/api/users/:id',
        async ({ request, params }) => {
            console.info('received request', request.url,'id:', params['id'])
            faker.seed(parseInt(params['id'] as string))
            const gender=faker.person.sexType();
            await delay(3*1000);
            return HttpResponse.json({
                id: faker.string.uuid(),
                gender: gender,
                firstName: faker.person.firstName(gender),
                lastName: faker.person.lastName()
            });
        }),
    http.get(
        '/api/users/',
        async ({ request }) => {
            await delay(2*500);
            console.info('received request', request.url,)
            const seeds=[234,657,23,456,2323].map(seed=>{
                faker.seed(seed)
                const gender=faker.person.sexType();
                return {
                    id: faker.string.uuid(),
                    gender: gender,
                    firstName: faker.person.firstName(gender),
                    lastName: faker.person.lastName()
                }
            })
            return HttpResponse.json(seeds, { status: 200 });
        }),
    http.post(
        '/uploadDocument',
        async ({ request }) => {
            await delay(2*500);
            console.info('received document upload request', request.url,)

            return HttpResponse.json({
                uploadStatus:'success',
                documentId: uuidv4()
            }, { status: 201 });
        }),
    http.post(
        '/submitForm',
        async ({ request }) => {
            await delay(2*500);
            console.info('received form submission request', request.url,)

            return HttpResponse.json({
                status:'success'
            }, { status: 201 });
        })
]