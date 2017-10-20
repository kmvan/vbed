<?php

namespace InnStudio\Vbed\Api;

trait TraitAjaxInit
{
    private function ajaxInit(): void
    {
        Helper::SessionStart();
        Helper::dieJson([
            'data' => [
                'csrf'       => Helper::genCsrf(),
                'isLoggedIn' => (bool) $this->getTokenFromCookie(),
                'oauthUrl'   => $this->getOauthUrl(),
            ],
        ]);
    }

    private function getOauthUrl()
    {
        $args = \http_build_query([
            'csrf'             => Helper::genCsrf(),
            'action'           => 'redirectToGetOaCode',
            'redirectToAppUrl' => URL . '/api/?action=setOauth',

        ]);

        return API_URL . '?' . $args;
    }
}
