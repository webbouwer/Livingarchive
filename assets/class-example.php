<?php
/*
 * HTML object class
 */

class html {

    public $request;

    public $html_head;
    public $header;
    public $body;
    public $footer;
    public $html_foot;

    public function __construct($request)
    {
        $this->request = $request;
    }
    public function headerBase() {
    }
    public function footerBase() {
    }

}
