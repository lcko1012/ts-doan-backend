import { Body, Controller, Get, HttpCode, JsonController, Param, Post, QueryParam, Req, Res } from "routing-controllers";
import 'reflect-metadata';

class HelloWorldPost {
    message: string
}

@JsonController('/hello-world')
export class HelloWorldController {
    @Get('/')
    index(@QueryParam('goodbye') goodbye: string) {
        if(goodbye === 'true') {
            return 'Goodbye';
        }
        return 'Hello world';
    }

    @Get('/x')
    helloWorld(@Req() req: any, @Res() res: any) {
        return res.send('Hello world');
    }

    @Get('/post/:id')
    show(@Param('id') postId: string) {
        return `Showing post with id ${postId}`;
    }

    @HttpCode(201)
    @Post('/add')
    store(@Body() newPostObj: HelloWorldPost) {
        return {
            type: typeof newPostObj,
            isHelloWorldPost: newPostObj.constructor.name,
            body: newPostObj
        }
    }
}