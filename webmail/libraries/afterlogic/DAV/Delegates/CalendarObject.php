<?php

class Afterlogic_Dav_Delegates_CalendarObject extends Sabre_CalDAV_CalendarObject {


    /**
     * Returns a list of ACE's for this node.
     *
     * Each ACE has the following properties:
     *   * 'privilege', a string such as {DAV:}read or {DAV:}write. These are 
     *     currently the only supported privileges
     *   * 'principal', a url to the principal who owns the node
     *   * 'protected' (optional), indicating that this ACE is not allowed to 
     *      be updated. 
     * 
     * @return array 
     */
    public function getACL() {

        return array(
            array(
                'privilege' => '{DAV:}read',
                'principal' => 'delegation/' . $this->calendarInfo['id'] . '/principal/calendar-proxy-write',
                'protected' => true,
            ),
            array(
                'privilege' => '{DAV:}write',
                'principal' => 'delegation/' . $this->calendarInfo['id'] . '/principal/calendar-proxy-write',
                'protected' => true,
            ),
            array(
                'privilege' => '{DAV:}read',
                'principal' => 'delegation/' . $this->calendarInfo['id'] . '/principal/calendar-proxy-read',
                'protected' => true,
            ),
        );

    }

}

