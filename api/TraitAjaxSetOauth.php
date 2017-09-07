<?php

namespace InnStudio\Vbed\Api;

trait TraitAjaxSetOauth
{
    private function ajaxSetOauth()
    {
        $data = \filter_input(INPUT_GET, 'data', FILTER_SANITIZE_STRING);
        $data = \json_decode(\base64_decode($data), true);

        if ( ! $data || ! isset($data['access_token'])) {
            die('Data error.');
        }

        $this->setTokenToCookie($data['access_token']); ?>
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <meta http-equiv="refresh" content="3;url=<?= URL; ?>">
            <title>授权成功！</title>
        </head>
        <body>
            <div style="text-align: center">
                <h1 style="color:green">授权成功！3 秒后自动跳转……</h1>
                <button onClick="location.href='<?= URL; ?>';">&lt; 返回到“微图床”</button>
            </div>
        </body>
        </html>
        <?php
        die;
    }
}
