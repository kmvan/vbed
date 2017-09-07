<?php

namespace InnStudio\Vbed\Api;

trait TraitAjaxUpload
{
    protected function ajaxUpload()
    {
        $file = $this->ajaxCheckFile();
        $res  = $this->postFile(
            API_URL . '?action=sendImg&csrf=' . Helper::createCsrf(),
            [
                'token'    => \base64_encode($this->getTokenFromCookie()),
                'img'      => new \CurlFile($file['tmp_name'], $file['type']),
                'clientIp' => Helper::getClientIp(),
            ]
        );

        $code = $res['code'] ?? false;

        if ($code === 0) {
            Helper::dieJson([
                'data' => [
                    'filename' => $res['data']['filename'],
                ],
            ]);
        } elseif ($code) {
            Helper::dieJson($res);
        }

        Helper::dieJson([
            'code' => -1,
            'msg'  => (string) $res,
        ]);
    }

    private function ajaxCheckFile()
    {
        $file = $_FILES['file'] ?? false;

        if ( ! $file) {
            Helper::dieJson([
                'code' => -1,
                'msg'  => 'Invalid file.',
            ]);
        }

        return $file;
    }

    private function postFile(string $url, array $fields)
    {
        $curl = \curl_init($url);
        \curl_setopt($curl, CURLOPT_POST, 1);
        \curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        \curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
        \curl_setopt($curl, CURLOPT_AUTOREFERER, 1);
        \curl_setopt($curl, CURLOPT_POSTFIELDS, $fields);

        $res = \curl_exec($curl);
        \curl_close($curl);

        $json = \json_decode($res, true);

        return $json ?: $res;
    }
}
