<?php
define('PROC_ERROR_ACCT_CREATE', 'Hubo un error durante la creación de la cuenta');
define('PROC_WRONG_ACCT_PWD', 'Password incorrecta');
define('PROC_CANT_LOG_NONDEF', 'No puede ingresar a la cuenta no predeterminada');
define('PROC_CANT_INS_NEW_FILTER', 'No puede agregar nuevo filtro');
define('PROC_FOLDER_EXIST', 'Nombre de carpeta existente');
define('PROC_CANT_CREATE_FLD', 'No se puede crear la carpeta');
define('PROC_CANT_INS_NEW_GROUP', 'No se puede agregar el nuevo grupo');
define('PROC_CANT_INS_NEW_CONT', 'No se puede agregar el nuevo contacto');
define('PROC_CANT_INS_NEW_CONTS', 'No se puede agregar el nuevo contacto(s)');
define('PROC_CANT_ADD_NEW_CONT_TO_GRP', 'No se puede agregar contacto(s) al grupo');
define('PROC_ERROR_ACCT_UPDATE', 'Hubo un error al actualizar la cuenta');
define('PROC_CANT_UPDATE_CONT_SETTINGS', 'No se puede actualizar la configuracion de contactos');
define('PROC_CANT_GET_SETTINGS', 'No se puede obtener configuracion');
define('PROC_CANT_UPDATE_ACCT', 'No se puede actualizar la configuracion');
define('PROC_ERROR_DEL_FLD', 'Hubo un error durante el borrado de la(s) carpeta(s)');
define('PROC_CANT_UPDATE_CONT', 'No se puede actualizar el contacto');
define('PROC_CANT_GET_FLDS', 'No se puede obtener el árbol de carpetas');
define('PROC_CANT_GET_MSG_LIST', 'No se puede obtener la lista de mensajes');
define('PROC_MSG_HAS_DELETED', 'Este mensaje ya ha sido borrado del servidor de mail');
define('PROC_CANT_LOAD_CONT_SETTINGS', 'No se pueden cargar las configuraciones de contactos');
define('PROC_CANT_LOAD_SIGNATURE', 'No se puede cargar la firma de la cuenta');
define('PROC_CANT_GET_CONT_FROM_DB', 'No se puede obtener contacto de la BD');
define('PROC_CANT_GET_CONTS_FROM_DB', 'No se pueden obtener los contacto(s) de la BD');
define('PROC_CANT_DEL_ACCT_BY_ID', 'No se puede eliminar la cuenta por id');
define('PROC_CANT_DEL_FILTER_BY_ID', 'No se puede eliminar el filtro por id');
define('PROC_CANT_DEL_CONT_GROUPS', 'No se pueden eliminar contacto(s) y/o grupos');
define('PROC_WRONG_ACCT_ACCESS', 'Se ha detectado un intento de acceso no autorizado a la cuenta de otro usuario');
define('PROC_SESSION_ERROR', 'La última sesión fue terminada debido a que se ha excedido el tiempo de espera.');

define('MailBoxIsFull', 'Casilla llena');
define('WebMailException', 'Ocurrió una excepción');
define('InvalidUid', 'UID de mensaje inválido');
define('CantCreateContactGroup', 'No se puede crear el grupo de contactos');
define('CantCreateUser', 'No se puede crear el usuario');
define('CantCreateAccount', 'No se puede crear la cuenta');
define('SessionIsEmpty', 'Sesión vacia');
define('FileIsTooBig', 'El archivo es demasiado grande');

define('PROC_CANT_MARK_ALL_MSG_READ', 'No se pueden marcar todos los mensajes como leídos');
define('PROC_CANT_MARK_ALL_MSG_UNREAD', 'No se pueden marcar todos los mensajes como no leídos');
define('PROC_CANT_PURGE_MSGS', 'No se pueden depurar mensaje(s)');
define('PROC_CANT_DEL_MSGS', 'No se pueden eliminar mensaje(s)');
define('PROC_CANT_UNDEL_MSGS', 'No se puede deshacer la eliminación de mensaje(s)');
define('PROC_CANT_MARK_MSGS_READ', 'No se pueden marcar el/los mensaje(s) como leídos');
define('PROC_CANT_MARK_MSGS_UNREAD', 'No se pueden marcar el/los mensaje(s) como no leídos');
define('PROC_CANT_SET_MSG_FLAGS', 'No se pueden habilitar las marcas de los mensaje(s)');
define('PROC_CANT_REMOVE_MSG_FLAGS', 'No se puede eliminar las marcas del mensaje(s)');
define('PROC_CANT_CHANGE_MSG_FLD', 'No se puede cambiar la carpeta de los mensaje(s)');
define('PROC_CANT_SEND_MSG', 'No se puede enviar el mensaje.');
define('PROC_CANT_SAVE_MSG', 'No se puede guardar el mensaje.');
define('PROC_CANT_GET_ACCT_LIST', 'No se puede obtener la lista de cuentas');
define('PROC_CANT_GET_FILTER_LIST', 'No se puede obtener la lista de filtros');

define('PROC_CANT_LEAVE_BLANK', 'No se pueden dejar en blanco los campos con *');

define('PROC_CANT_UPD_FLD', 'No se puede actualizar la carpeta');
define('PROC_CANT_UPD_FILTER', 'No se puede actualizar el filtro');

define('ACCT_CANT_ADD_DEF_ACCT', 'Esta cuenta no puede ser agregada porque está siendo usada como la cuenta predeterminada poor otro usuario.');
define('ACCT_CANT_UPD_TO_DEF_ACCT', 'El estado de esta cuenta no puede ser cambiado a predeterminado.');
define('ACCT_CANT_CREATE_IMAP_ACCT', 'No se puede crear una nueva cuenta (error de conexión IMAP4)');
define('ACCT_CANT_DEL_LAST_DEF_ACCT', 'No se puede eliminar la última cuenta predeterminada');

define('LANG_LoginInfo', 'Información de Usuario');
define('LANG_Email', 'Email');
define('LANG_Login', 'Usuario');
define('LANG_Password', 'Clave');
define('LANG_IncServer', 'Mail&nbsp;Entrante');
define('LANG_PopProtocol', 'POP3');
define('LANG_ImapProtocol', 'IMAP4');
define('LANG_IncPort', 'Puerto');
define('LANG_OutServer', 'Mail&nbsp;Saliente');
define('LANG_OutPort', 'Puerto');
define('LANG_UseSmtpAuth', 'Usar&nbsp;Autenticación&nbsp;SMTP');
define('LANG_SignMe', 'Recordarme en este equipo');
define('LANG_Enter', 'Ingresar');

// interface strings

define('JS_LANG_TitleLogin', 'Ingresar');
define('JS_LANG_TitleMessagesListView', 'Lista Mensajes');
define('JS_LANG_TitleMessagesList', 'Lista Mensajes');
define('JS_LANG_TitleViewMessage', 'Ver Mensaje');
define('JS_LANG_TitleNewMessage', 'Nuevo Mensaje');
define('JS_LANG_TitleSettings', 'Configuraciones');
define('JS_LANG_TitleContacts', 'Contactos');

define('JS_LANG_StandardLogin', 'Ingreso&nbsp;Standard');
define('JS_LANG_AdvancedLogin', 'Ingreso&nbsp;Avanzado');

define('JS_LANG_InfoWebMailLoading', 'Cargando mails&hellip;por favor esperar&hellip;');
define('JS_LANG_Loading', 'Cargando&hellip;');
define('JS_LANG_InfoMessagesLoad', 'Cargando lista de mensajes&hellip;por favor esperar');
define('JS_LANG_InfoEmptyFolder', 'Carpeta vacia');
define('JS_LANG_InfoPageLoading', 'La página está aún cargando&hellip;');
define('JS_LANG_InfoSendMessage', 'El mensaje fue enviado');
define('JS_LANG_InfoSaveMessage', 'El mensaje fue grabado');
define('JS_LANG_InfoHaveImported', 'Usted ha importado');
define('JS_LANG_InfoNewContacts', 'nuevos contactos(s) en su lista de contactos.');
define('JS_LANG_InfoToDelete', 'A Borrar');
define('JS_LANG_InfoDeleteContent', 'carpeta que tiene que borrar todo su contenido primero.');
define('JS_LANG_InfoDeleteNotEmptyFolders', 'No se permite borrar carpetas no vacias. Para borrar carpetas borre su contenido primero.');
define('JS_LANG_InfoRequiredFields', '* campo requerido');

define('JS_LANG_ConfirmAreYouSure', 'Esta Seguro?');
define('JS_LANG_ConfirmDirectModeAreYouSure', 'Los mensaje(s) seleccionado(s) será DEFINITIVAMENTE eliminados! Esta seguro?');
define('JS_LANG_ConfirmSaveSettings', 'Las configuraciones no fueron guardadas. Seleccione OK para guardarlas.');
define('JS_LANG_ConfirmSaveContactsSettings', 'Las configuraciones de contactos no fueron guardadas. Seleccione OK para guardarlas.');
define('JS_LANG_ConfirmSaveAcctProp', 'Las propiedades de la cuenta no fueron guardadas. Seleccione OK para guardarlas.');
define('JS_LANG_ConfirmSaveFilter', 'Las propiedades de filtros no fueron guardadas. Seleccione OK para guardarlas.');
define('JS_LANG_ConfirmSaveSignature', 'La firma no fue guardada. Seleccione OK para guardarlas.');
define('JS_LANG_ConfirmSavefolders', 'Las carpetas no fueron guardadas. Seleccione OK para guardarlas.');
define('JS_LANG_ConfirmHtmlToPlain', 'Advertencia: Cambiando el formato de este mensaje de HTML a texto plano, perderá cualquier formato que posea en el mensaje. Seleccione OK para continuar.');
define('JS_LANG_ConfirmAddFolder', 'Antes de agregar una carpeta es necesario aplicar los cambios. Seleccione OK para guardarlas.');
define('JS_LANG_ConfirmEmptySubject', 'El campo asunto esta vacio. Desea continuar ?');

define('JS_LANG_WarningEmailBlank', 'No puede dejar el campo<br />Email: vacio');
define('JS_LANG_WarningLoginBlank', 'No puede dejar el campo<br />Usuario: vacio');
define('JS_LANG_WarningToBlank', 'No puede dejar el campo Para: vacio');
define('JS_LANG_WarningServerPortBlank', 'No puede dejar los campos POP3 y<br />servidor/puerto SMTP vacios');
define('JS_LANG_WarningEmptySearchLine', 'Linea búsqueda vacia. Por favor ingrese una porción del texto que necesita buscar');
define('JS_LANG_WarningMarkListItem', 'Por favor, marcar al menos un elemento de la lista');
define('JS_LANG_WarningFolderMove', 'La carpeta no puede ser movida porque está en otro nivel');
define('JS_LANG_WarningContactNotComplete', 'Por favor ingrese mail o nombre');
define('JS_LANG_WarningGroupNotComplete', 'Por favor ingrese un nombre de grupo');

define('JS_LANG_WarningEmailFieldBlank', 'No puede dejar el campo Email vacio');
define('JS_LANG_WarningIncServerBlank', 'No puede dejar el campo Servidor POP3(IMAP4) vacio');
define('JS_LANG_WarningIncPortBlank', 'No puede dejar el campo Puerto Servidor POP3(IMAP4) vacio');
define('JS_LANG_WarningIncLoginBlank', 'No puede dejar el campo Usuario POP3(IMAP4) vacio');
define('JS_LANG_WarningIncPortNumber', 'Debería especificar un número positivo en el campo puerto POP3(IMAP4).');
define('JS_LANG_DefaultIncPortNumber', 'El número de puerto POP3(IMAP4) predeterminado es 110(143).');
define('JS_LANG_WarningIncPassBlank', 'No puede dejar el campo Clave POP3(IMAP4) vacio');
define('JS_LANG_WarningOutPortBlank', 'No puede dejar el Puerto del Servidor SMTP vacio');
define('JS_LANG_WarningOutPortNumber', 'Debería especificar un número positivo en el campo puerto SMTP.');
define('JS_LANG_WarningCorrectEmail', 'Debe especificar una e-mail válido.');
define('JS_LANG_DefaultOutPortNumber', 'El puerto SMTP predeterminado es el 25.');

define('JS_LANG_WarningCsvExtention', 'La extensión debe ser .csv');
define('JS_LANG_WarningImportFileType', 'Por favor seleccione la aplicación desde la que desea copiar sus contactos');
define('JS_LANG_WarningEmptyImportFile', 'Por favor seleccione un archivo presionando el botón Seleccionar');

define('JS_LANG_WarningContactsPerPage', 'El valor contactos por página es un número positivo');
define('JS_LANG_WarningMessagesPerPage', 'El valor mensajes por página es un número positivo');
define('JS_LANG_WarningMailsOnServerDays', 'Debe especificar un número positivo en el campo Mensajes en servidor (días).');
define('JS_LANG_WarningEmptyFilter', 'Por favor ingrese un texto');
define('JS_LANG_WarningEmptyFolderName', 'Por favor ingrese un nombre de carpeta');

define('JS_LANG_ErrorConnectionFailed', 'Conexión fallida');
define('JS_LANG_ErrorRequestFailed', 'La transferencia de datos no ha sido completada');
define('JS_LANG_ErrorAbsentXMLHttpRequest', 'El objeto XMLHttpRequest está ausente');
define('JS_LANG_ErrorWithoutDesc', 'Ocurrió un error sin descripción');
define('JS_LANG_ErrorParsing', 'Error al parsear XML.');
define('JS_LANG_ResponseText', 'Texto Respuesta:');
define('JS_LANG_ErrorEmptyXmlPacket', 'Paquete XML vacio');
define('JS_LANG_ErrorImportContacts', 'Error al importar contactos');
define('JS_LANG_ErrorNoContacts', 'Sin contactos para importar');
define('JS_LANG_ErrorCheckMail', 'Recepción de mensajes terminada debido a un error. Probablemente, no todos los mensajes se han recibido.');

define('JS_LANG_LoggingToServer', 'Ingresando al servidor&hellip;');
define('JS_LANG_GettingMsgsNum', 'Obteniendo cantidad de mensajes');
define('JS_LANG_RetrievingMessage', 'Obteniendo mensajes');
define('JS_LANG_DeletingMessage', 'Borrando mensajes');
define('JS_LANG_DeletingMessages', 'Borrando mensaje(s)');
define('JS_LANG_Of', 'de');
define('JS_LANG_Connection', 'Conexión');
define('JS_LANG_Charset', 'Charset');
define('JS_LANG_AutoSelect', 'Auto-Select');

define('JS_LANG_Contacts', 'Contactos');
define('JS_LANG_ClassicVersion', 'Version clásica');
define('JS_LANG_Logout', 'Salir');
define('JS_LANG_Settings', 'Configuración');

define('JS_LANG_LookFor', 'Buscar: ');
define('JS_LANG_SearchIn', 'Buscan en: ');
define('JS_LANG_QuickSearch', 'Buscar en campos De, Para y Asuento solamente (rápido).');
define('JS_LANG_SlowSearch', 'Buscar mensaje completo');
define('JS_LANG_AllMailFolders', 'Todas las Carpetas');
define('JS_LANG_AllGroups', 'Todos los Grupos');

define('JS_LANG_NewMessage', 'Nuevo Mensaje');
define('JS_LANG_CheckMail', 'Revisar Mail');
define('JS_LANG_EmptyTrash', 'Papelera Vacia');
define('JS_LANG_MarkAsRead', 'Marcar como Leído');
define('JS_LANG_MarkAsUnread', 'Marcar como No Leído');
define('JS_LANG_MarkFlag', 'Marcar');
define('JS_LANG_MarkUnflag', 'Desmarcar');
define('JS_LANG_MarkAllRead', 'Marcar Todos Leídos');
define('JS_LANG_MarkAllUnread', 'Marcar Todos No Leídos');
define('JS_LANG_Reply', 'Responder');
define('JS_LANG_ReplyAll', 'Responder a todos');
define('JS_LANG_Delete', 'Borrar');
define('JS_LANG_Undelete', 'Deshacer');
define('JS_LANG_PurgeDeleted', 'Depurar borrados');
define('JS_LANG_MoveToFolder', 'Mover a Carpeta');
define('JS_LANG_Forward', 'Reenviar');

define('JS_LANG_HideFolders', 'Ocultar Carpetas');
define('JS_LANG_ShowFolders', 'Ver Carpetas');
define('JS_LANG_ManageFolders', 'Administrar Carpetas');
define('JS_LANG_SyncFolder', 'Sincronizar Carpetas');
define('JS_LANG_NewMessages', 'Nuevo Mensaje');
define('JS_LANG_Messages', 'Mensaje(s)');

define('JS_LANG_From', 'De');
define('JS_LANG_To', 'Para');
define('JS_LANG_Date', 'Fecha');
define('JS_LANG_Size', 'Tamaño');
define('JS_LANG_Subject', 'Asunto');

define('JS_LANG_FirstPage', 'Primer Página');
define('JS_LANG_PreviousPage', 'Página Anterior');
define('JS_LANG_NextPage', 'Siguiente Página');
define('JS_LANG_LastPage', 'Ultima Página');

define('JS_LANG_SwitchToPlain', 'Cambiar a vista Plana');
define('JS_LANG_SwitchToHTML', 'Cambiar a vista HTML');
define('JS_LANG_AddToAddressBook', 'Agregar a Agenda de Contactos');
define('JS_LANG_ClickToDownload', 'Click para descargar');
define('JS_LANG_View', 'Vista');
define('JS_LANG_ShowFullHeaders', 'Ver Encabezados Completos');
define('JS_LANG_HideFullHeaders', 'Ocultar Encabezados Completos');

define('JS_LANG_MessagesInFolder', 'Mensajes(s) en Carpeta');
define('JS_LANG_YouUsing', 'Estás usando');
define('JS_LANG_OfYour', 'de tu');
define('JS_LANG_Mb', 'MB');
define('JS_LANG_Kb', 'KB');
define('JS_LANG_B', 'B');

define('JS_LANG_SendMessage', 'Enviar');
define('JS_LANG_SaveMessage', 'Guardar');
define('JS_LANG_Print', 'Imprimir');
define('JS_LANG_PreviousMsg', 'Mensaje Anterior');
define('JS_LANG_NextMsg', 'Mensaje Siguiente');
define('JS_LANG_AddressBook', 'Agenda Contactos');
define('JS_LANG_ShowBCC', 'Mostrar BCC');
define('JS_LANG_HideBCC', 'Ocultar BCC');
define('JS_LANG_CC', 'CC');
define('JS_LANG_BCC', 'BCC');
define('JS_LANG_ReplyTo', 'Responder&nbsp;A');
define('JS_LANG_AttachFile', 'Adjuntar Archivo');
define('JS_LANG_Attach', 'Adjuntar');
define('JS_LANG_Re', 'Re');
define('JS_LANG_OriginalMessage', 'Mensaje Original');
define('JS_LANG_Sent', 'Enviado');
define('JS_LANG_Fwd', 'Fwd');
define('JS_LANG_Low', 'Baja');
define('JS_LANG_Normal', 'Normal');
define('JS_LANG_High', 'Alta');
define('JS_LANG_Importance', 'Importante');
define('JS_LANG_Close', 'Cerrar');

define('JS_LANG_Common', 'Común');
define('JS_LANG_EmailAccounts', 'Cuentas EMail');

define('JS_LANG_MsgsPerPage', 'Mensajes por página');
define('JS_LANG_DisableRTE', 'Desabilitar editor texto entiquecido');
define('JS_LANG_Skin', 'Skin');
define('JS_LANG_DefCharset', 'Juego caracteres predeterminado');
define('JS_LANG_DefCharsetInc', 'Juego caracteres entrantes predeterminado');
define('JS_LANG_DefCharsetOut', 'Juego caracteres salientes predeterminado');
define('JS_LANG_DefTimeOffset', 'Zona horaria predeterminada');
define('JS_LANG_DefLanguage', 'Lenguaje predeterminado');
define('JS_LANG_DefDateFormat', 'Formato fecha predeterminado');
define('JS_LANG_ShowViewPane', 'Lista de mensajes con panel de previsualizacion');
define('JS_LANG_Save', 'Guardar');
define('JS_LANG_Cancel', 'Cancelar');
define('JS_LANG_OK', 'OK');

define('JS_LANG_Remove', 'Remove');
define('JS_LANG_AddNewAccount', 'Agregar Nueva Cuenta');
define('JS_LANG_Signature', 'Firma');
define('JS_LANG_Filters', 'Filtros');
define('JS_LANG_Properties', 'Propiedades');
define('JS_LANG_UseForLogin', 'Usar propiedades de esta cuenta (usuario y clave) para ingresar');
define('JS_LANG_MailFriendlyName', 'Tu nombre');
define('JS_LANG_MailEmail', 'Email');
define('JS_LANG_MailIncHost', 'Correo Entrante');
define('JS_LANG_Imap4', 'IMAP4');
define('JS_LANG_Pop3', 'POP3');
define('JS_LANG_MailIncPort', 'Puerto');
define('JS_LANG_MailIncLogin', 'Usuario');
define('JS_LANG_MailIncPass', 'Clave');
define('JS_LANG_MailOutHost', 'Correo Saliente');
define('JS_LANG_MailOutPort', 'Puerto');
define('JS_LANG_MailOutLogin', 'Usuario SMTP');
define('JS_LANG_MailOutPass', 'Clave SMTP');
define('JS_LANG_MailOutAuth1', 'Usar autenticación SMTP');
define('JS_LANG_MailOutAuth2', '(Debe dejar los campos usuario/clave SMTP, si son las mismas que para POP3/IMAP4)');
define('JS_LANG_UseFriendlyNm1', 'Usar Nombre Amigable en el campo "De:"');
define('JS_LANG_UseFriendlyNm2', '(Tu nombre &lt;sender@mail.com&gt;)');
define('JS_LANG_GetmailAtLogin', 'Obtener/sincronizar mails al ingresar');
define('JS_LANG_MailMode0', 'Eliminar mensajes recibidos del servidor');
define('JS_LANG_MailMode1', 'Dejar mensajes en el servidor');
define('JS_LANG_MailMode2', 'Mantener mensajes en servidor por');
define('JS_LANG_MailsOnServerDays', 'día(s)');
define('JS_LANG_MailMode3', 'Eliminar mensaje del servidor cuando es eliminado de Papelera');
define('JS_LANG_InboxSyncType', 'Tipo de Sincronización de Bandeja de Entrada');

define('JS_LANG_SyncTypeNo', 'No Sincronizar');
define('JS_LANG_SyncTypeNewHeaders', 'Nuevos Encabezados');
define('JS_LANG_SyncTypeAllHeaders', 'Todos los Encabezados');
define('JS_LANG_SyncTypeNewMessages', 'Nuevos Mensajes');
define('JS_LANG_SyncTypeAllMessages', 'Todos los Mensajes');
define('JS_LANG_SyncTypeDirectMode', 'Modo Directo');

define('JS_LANG_Pop3SyncTypeEntireHeaders', 'Encabezados Solamente');
define('JS_LANG_Pop3SyncTypeEntireMessages', 'Mensajes Completos');
define('JS_LANG_Pop3SyncTypeDirectMode', 'Modo Directo');

define('JS_LANG_DeleteFromDb', 'Borrar mensajes de la base de datos si no existen más en el servidor');

define('JS_LANG_EditFilter', 'Editar filtro');
define('JS_LANG_NewFilter', 'Agregar nuevo filtro');
define('JS_LANG_Field', 'Campo');
define('JS_LANG_Condition', 'Condición');
define('JS_LANG_ContainSubstring', 'Contener texto');
define('JS_LANG_ContainExactPhrase', 'Contener frase exacta');
define('JS_LANG_NotContainSubstring', 'No conteniendo texto');
define('JS_LANG_FilterDesc_At', 'a');
define('JS_LANG_FilterDesc_Field', 'campo');
define('JS_LANG_Action', 'Acción');
define('JS_LANG_DoNothing', 'Hacer Nada');
define('JS_LANG_DeleteFromServer', 'Borrar del server inmediatamente');
define('JS_LANG_MarkGrey', 'Marcar gris');
define('JS_LANG_Add', 'Agregar');
define('JS_LANG_OtherFilterSettings', 'Otras configuraciones de filtros');
define('JS_LANG_ConsiderXSpam', 'Considerar encabezados X-Spam');
define('JS_LANG_Apply', 'Aplicar');

define('JS_LANG_InsertLink', 'Insertar Link');
define('JS_LANG_RemoveLink', 'Eliminar Link');
define('JS_LANG_Numbering', 'Enumerar');
define('JS_LANG_Bullets', 'Viñetas');
define('JS_LANG_HorizontalLine', 'Linea Horizontal');
define('JS_LANG_Bold', 'Negrita');
define('JS_LANG_Italic', 'Italica');
define('JS_LANG_Underline', 'Subrayar');
define('JS_LANG_AlignLeft', 'Alinear Izquierda');
define('JS_LANG_Center', 'Centrar');
define('JS_LANG_AlignRight', 'Alinear Derecha');
define('JS_LANG_Justify', 'Justificar');
define('JS_LANG_FontColor', 'Color Letra');
define('JS_LANG_Background', 'Fondo');
define('JS_LANG_SwitchToPlainMode', 'Cambiar a Modo Texto');
define('JS_LANG_SwitchToHTMLMode', 'Cambiar a Modo HTML');

define('JS_LANG_Folder', 'Carpeta');
define('JS_LANG_Msgs', 'Msg\'s');
define('JS_LANG_Synchronize', 'Sincronizar');
define('JS_LANG_ShowThisFolder', 'Ver esta Carpeta');
define('JS_LANG_Total', 'Total');
define('JS_LANG_DeleteSelected', 'Borrar Seleccionados');
define('JS_LANG_AddNewFolder', 'Agregar Nueva Carpeta');
define('JS_LANG_NewFolder', 'Nueva Carpeta');
define('JS_LANG_ParentFolder', 'Carpeta Padre');
define('JS_LANG_NoParent', 'Sin Padres');
define('JS_LANG_FolderName', 'Nombre Carpeta');

define('JS_LANG_ContactsPerPage', 'Contactos por Página');
define('JS_LANG_WhiteList', 'Lista de Contactos como Lista Blanca');

define('JS_LANG_CharsetDefault', 'Default');
define('JS_LANG_CharsetArabicAlphabetISO', 'Arabic Alphabet (ISO)');
define('JS_LANG_CharsetArabicAlphabet', 'Arabic Alphabet (Windows)');
define('JS_LANG_CharsetBalticAlphabetISO', 'Baltic Alphabet (ISO)');
define('JS_LANG_CharsetBalticAlphabet', 'Baltic Alphabet (Windows)');
define('JS_LANG_CharsetCentralEuropeanAlphabetISO', 'Central European Alphabet (ISO)');
define('JS_LANG_CharsetCentralEuropeanAlphabet', 'Central European Alphabet (Windows)');
define('JS_LANG_CharsetChineseSimplifiedEUC', 'Chinese Simplified (EUC)');
define('JS_LANG_CharsetChineseSimplifiedGB', 'Chinese Simplified (GB2312)');
define('JS_LANG_CharsetChineseTraditional', 'Chinese Traditional (Big5)');
define('JS_LANG_CharsetCyrillicAlphabetISO', 'Cyrillic Alphabet (ISO)');
define('JS_LANG_CharsetCyrillicAlphabetKOI8R', 'Cyrillic Alphabet (KOI8-R)');
define('JS_LANG_CharsetCyrillicAlphabet', 'Cyrillic Alphabet (Windows)');
define('JS_LANG_CharsetGreekAlphabetISO', 'Greek Alphabet (ISO)');
define('JS_LANG_CharsetGreekAlphabet', 'Greek Alphabet (Windows)');
define('JS_LANG_CharsetHebrewAlphabetISO', 'Hebrew Alphabet (ISO)');
define('JS_LANG_CharsetHebrewAlphabet', 'Hebrew Alphabet (Windows)');
define('JS_LANG_CharsetJapanese', 'Japanese');
define('JS_LANG_CharsetJapaneseShiftJIS', 'Japanese (Shift-JIS)');
define('JS_LANG_CharsetKoreanEUC', 'Korean (EUC)');
define('JS_LANG_CharsetKoreanISO', 'Korean (ISO)');
define('JS_LANG_CharsetLatin3AlphabetISO', 'Latin 3 Alphabet (ISO)');
define('JS_LANG_CharsetTurkishAlphabet', 'Turkish Alphabet');
define('JS_LANG_CharsetUniversalAlphabetUTF7', 'Universal Alphabet (UTF-7)');
define('JS_LANG_CharsetUniversalAlphabetUTF8', 'Universal Alphabet (UTF-8)');
define('JS_LANG_CharsetVietnameseAlphabet', 'Vietnamese Alphabet (Windows)');
define('JS_LANG_CharsetWesternAlphabetISO', 'Western Alphabet (ISO)');
define('JS_LANG_CharsetWesternAlphabet', 'Western Alphabet (Windows)');

define('JS_LANG_TimeDefault', 'Predeterminado');
define('JS_LANG_TimeEniwetok', 'Eniwetok, Kwajalein, Dateline Time');
define('JS_LANG_TimeMidwayIsland', 'Midway Island, Samoa');
define('JS_LANG_TimeHawaii', 'Hawaii');
define('JS_LANG_TimeAlaska', 'Alaska');
define('JS_LANG_TimePacific', 'Pacific Time (US & Canada); Tijuana');
define('JS_LANG_TimeArizona', 'Arizona');
define('JS_LANG_TimeMountain', 'Mountain Time (US & Canada)');
define('JS_LANG_TimeCentralAmerica', 'Central America');
define('JS_LANG_TimeCentral', 'Central Time (US & Canada)');
define('JS_LANG_TimeMexicoCity', 'Mexico City, Tegucigalpa');
define('JS_LANG_TimeSaskatchewan', 'Saskatchewan');
define('JS_LANG_TimeIndiana', 'Indiana (East)');
define('JS_LANG_TimeEastern', 'Eastern Time (US & Canada)');
define('JS_LANG_TimeBogota', 'Bogota, Lima, Quito');
define('JS_LANG_TimeSantiago', 'Santiago');
define('JS_LANG_TimeCaracas', 'Caracas, La Paz');
define('JS_LANG_TimeAtlanticCanada', 'Atlantic Time (Canada)');
define('JS_LANG_TimeNewfoundland', 'Newfoundland');
define('JS_LANG_TimeGreenland', 'Greenland');
define('JS_LANG_TimeBuenosAires', 'Buenos Aires, Georgetown');
define('JS_LANG_TimeBrasilia', 'Brasilia');
define('JS_LANG_TimeMidAtlantic', 'Mid-Atlantic');
define('JS_LANG_TimeCapeVerde', 'Cape Verde Is.');
define('JS_LANG_TimeAzores', 'Azores');
define('JS_LANG_TimeMonrovia', 'Casablanca, Monrovia');
define('JS_LANG_TimeGMT', 'Dublin, Edinburgh, Lisbon, London');
define('JS_LANG_TimeBerlin', 'Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna');
define('JS_LANG_TimePrague', 'Belgrade, Bratislava, Budapest, Ljubljana, Prague');
define('JS_LANG_TimeParis', 'Brussels, Copenhagen, Madrid, Paris');
define('JS_LANG_TimeSarajevo', 'Sarajevo, Skopje, Sofija, Warsaw, Zagreb');
define('JS_LANG_TimeWestCentralAfrica', 'West Central Africa');
define('JS_LANG_TimeAthens', 'Athens, Istanbul, Minsk');
define('JS_LANG_TimeEasternEurope', 'Bucharest');
define('JS_LANG_TimeCairo', 'Cairo');
define('JS_LANG_TimeHarare', 'Harare, Pretoria');
define('JS_LANG_TimeHelsinki', 'Helsinki, Riga, Tallinn, Vilnius');
define('JS_LANG_TimeIsrael', 'Israel, Jerusalem Standard Time');
define('JS_LANG_TimeBaghdad', 'Baghdad');
define('JS_LANG_TimeArab', 'Arab, Kuwait, Riyadh');
define('JS_LANG_TimeMoscow', 'Moscow, St. Petersburg, Volgograd');
define('JS_LANG_TimeEastAfrica', 'East Africa, Nairobi');
define('JS_LANG_TimeTehran', 'Tehran');
define('JS_LANG_TimeAbuDhabi', 'Abu Dhabi, Muscat');
define('JS_LANG_TimeCaucasus', 'Baku, Tbilisi, Yerevan');
define('JS_LANG_TimeKabul', 'Kabul');
define('JS_LANG_TimeEkaterinburg', 'Ekaterinburg');
define('JS_LANG_TimeIslamabad', 'Islamabad, Karachi, Sverdlovsk, Tashkent');
define('JS_LANG_TimeBombay', 'Calcutta, Chennai, Mumbai, New Delhi, India Standard Time');
define('JS_LANG_TimeNepal', 'Kathmandu, Nepal');
define('JS_LANG_TimeAlmaty', 'Almaty, North Central Asia');
define('JS_LANG_TimeDhaka', 'Astana, Dhaka');
define('JS_LANG_TimeSriLanka', 'Sri Jayawardenepura, Sri Lanka');
define('JS_LANG_TimeRangoon', 'Rangoon');
define('JS_LANG_TimeBangkok', 'Bangkok, Novosibirsk, Hanoi, Jakarta');
define('JS_LANG_TimeKrasnoyarsk', 'Krasnoyarsk');
define('JS_LANG_TimeBeijing', 'Beijing, Chongqing, Hong Kong SAR, Urumqi');
define('JS_LANG_TimeUlaanBataar', 'Ulaan Bataar');
define('JS_LANG_TimeSingapore', 'Kuala Lumpur, Singapore');
define('JS_LANG_TimePerth', 'Perth, Western Australia');
define('JS_LANG_TimeTaipei', 'Taipei');
define('JS_LANG_TimeTokyo', 'Osaka, Sapporo, Tokyo, Irkutsk');
define('JS_LANG_TimeSeoul', 'Seoul, Korea Standard time');
define('JS_LANG_TimeYakutsk', 'Yakutsk');
define('JS_LANG_TimeAdelaide', 'Adelaide, Central Australia');
define('JS_LANG_TimeDarwin', 'Darwin');
define('JS_LANG_TimeBrisbane', 'Brisbane, East Australia');
define('JS_LANG_TimeSydney', 'Canberra, Melbourne, Sydney, Hobart');
define('JS_LANG_TimeGuam', 'Guam, Port Moresby');
define('JS_LANG_TimeHobart', 'Hobart, Tasmania');
define('JS_LANG_TimeVladivostock', 'Vladivostok');
define('JS_LANG_TimeSolomonIs', 'Solomon Is., New Caledonia');
define('JS_LANG_TimeWellington', 'Auckland, Wellington, Magadan');
define('JS_LANG_TimeFiji', 'Fiji Islands, Kamchatka, Marshall Is.');
define('JS_LANG_TimeTonga', 'Nuku\'alofa, Tonga');

define('JS_LANG_DateDefault', 'Predeterminado');
define('JS_LANG_DateDDMMYY', 'DD/MM/YY');
define('JS_LANG_DateMMDDYY', 'MM/DD/YY');
define('JS_LANG_DateDDMonth', 'DD Mes (01 Ene)');
define('JS_LANG_DateAdvanced', 'Avanzado');

define('JS_LANG_NewContact', 'Nuevo Contact');
define('JS_LANG_NewGroup', 'Nuevo Grupo');
define('JS_LANG_AddContactsTo', 'Agregar Contactos A');
define('JS_LANG_ImportContacts', 'Importar Contactos');

define('JS_LANG_Name', 'Nombre');
define('JS_LANG_Email', 'Email');
define('JS_LANG_DefaultEmail', 'Email Predeterminado');
define('JS_LANG_NotSpecifiedYet', 'No Especificado');
define('JS_LANG_ContactName', 'Nombre');
define('JS_LANG_Birthday', 'Cumpleaños');
define('JS_LANG_Month', 'Mes');
define('JS_LANG_January', 'Enero');
define('JS_LANG_February', 'Febrero');
define('JS_LANG_March', 'Marzo');
define('JS_LANG_April', 'Abril');
define('JS_LANG_May', 'Mayo');
define('JS_LANG_June', 'Junio');
define('JS_LANG_July', 'Julio');
define('JS_LANG_August', 'Agosto');
define('JS_LANG_September', 'Septiembre');
define('JS_LANG_October', 'Octubre');
define('JS_LANG_November', 'Noviembre');
define('JS_LANG_December', 'Diciembre');
define('JS_LANG_Day', 'Dia');
define('JS_LANG_Year', 'Año');
define('JS_LANG_UseFriendlyName1', 'Usar Nombre Amigable');
define('JS_LANG_UseFriendlyName2', '(por ejemplo, Juan Garcia &lt;juangarcia@mail.com&gt;)');
define('JS_LANG_Personal', 'Personal');
define('JS_LANG_PersonalEmail', 'E-mail Personal');
define('JS_LANG_StreetAddress', 'Calle');
define('JS_LANG_City', 'Ciudad');
define('JS_LANG_Fax', 'Fax');
define('JS_LANG_StateProvince', 'Estado/Provincia');
define('JS_LANG_Phone', 'Tel.');
define('JS_LANG_ZipCode', 'Cod. Postal');
define('JS_LANG_Mobile', 'Celular');
define('JS_LANG_CountryRegion', 'País/Región');
define('JS_LANG_WebPage', 'Página Web');
define('JS_LANG_Go', 'Ir');
define('JS_LANG_Home', 'Casa');
define('JS_LANG_Business', 'Trabajo');
define('JS_LANG_BusinessEmail', 'E-mail Laboral');
define('JS_LANG_Company', 'Empresa');
define('JS_LANG_JobTitle', 'Cargo');
define('JS_LANG_Department', 'Departamento');
define('JS_LANG_Office', 'Oficina');
define('JS_LANG_Pager', 'Pager');
define('JS_LANG_Other', 'Otros');
define('JS_LANG_OtherEmail', 'Otro E-mail');
define('JS_LANG_Notes', 'Notas');
define('JS_LANG_Groups', 'Grupos');
define('JS_LANG_ShowAddFields', 'Ver campos adicionales');
define('JS_LANG_HideAddFields', 'Ocultar campos adicionales');
define('JS_LANG_EditContact', 'Editar información Contacto');
define('JS_LANG_GroupName', 'Nombre Grupo');
define('JS_LANG_AddContacts', 'Agregar Contactos');
define('JS_LANG_CommentAddContacts', '(Si agregará más de una dirección, por favor separarla con comas)');
define('JS_LANG_CreateGroup', 'Crear Grupo');
define('JS_LANG_Rename', 'renombrar');
define('JS_LANG_MailGroup', 'Grupo Mails');
define('JS_LANG_RemoveFromGroup', 'Eliminar del grupo');
define('JS_LANG_UseImportTo', 'Usar importar para copiar tus contactos desde Microsoft Outlook, Microsoft Outlook Express en tu lista de contactos.');
define('JS_LANG_Outlook1', 'Microsoft Outlook 2000/XP/2003');
define('JS_LANG_Outlook2', 'Microsoft Outlook Express 6');
define('JS_LANG_SelectImportFile', 'Seleccionar archivo  (formato .CSV) que quieres importar');
define('JS_LANG_Import', 'Importar');
define('JS_LANG_ContactsMessage', 'Esta es una página de Contactos!!!');
define('JS_LANG_ContactsCount', 'contacto(s)');
define('JS_LANG_GroupsCount', 'grupo(s)');

// webmail 4.1 constants
define('PicturesBlocked', 'Las imágenes en este mensaje han sido bloqueadas por su seguridad.');
define('ShowPictures', 'Mostrar Imágenes');
define('ShowPicturesFromSender', 'Siempre mostrar imágenes en mensajes de este emisor');
define('AlwaysShowPictures', 'Siempre mostrar imágenes en mensajes');

define('TreatAsOrganization', 'Tratar como una Organización');

define('WarningGroupAlreadyExist', 'Ya existe un grupo con este nombre. por favor especificar otro nombre.');
define('WarningCorrectFolderName', 'Debe especificar un nombre de carpeta correcto.');
define('WarningLoginFieldBlank', 'No puede dejar el campo Usuario en blanco.');
define('WarningCorrectLogin', 'Debe especificar un usuario correcto.');
define('WarningPassBlank', 'No puede dejar el campo Clave en blanco.');
define('WarningCorrectIncServer', 'Debe especificar un servidor POP3(IMAP) válido.');
define('WarningCorrectSMTPServer', 'Debe especificar una dirección de correo saliente correcta.');
define('WarningFromBlank', 'No puede dejar el campo De: vacio.');
define('WarningAdvancedDateFormat', 'Por favor especifique un formato fecha-hora.');

define('AdvancedDateHelpTitle', 'Fecha Avanzada');
define('AdvancedDateHelpIntro', 'Cuando el campo &quot;Avanzado&quot; está seleccionado, puede usar el campo de texto para configurar su propio formato de fecha, el cual podrá ser visualizado en GaneTiempoyDinero. Las siguientes opciones son utilizadas para éste propósito junto con los delimitadores \':\' o \'/\':');
define('AdvancedDateHelpConclusion', 'Por ejemplo, si especifica el valor &quot;mm/dd/yyyy&quot; en el campo de texto de &quot;Avanzado&quot;, la fecha es visualizada como mes/día/año (ej. 11/23/2005)');
define('AdvancedDateHelpDayOfMonth', 'Día del mes (1 a 31)');
define('AdvancedDateHelpNumericMonth', 'Mes (1 a 12)');
define('AdvancedDateHelpTextualMonth', 'Mes (Ene a Dic)');
define('AdvancedDateHelpYear2', 'Año, 2 dígitos');
define('AdvancedDateHelpYear4', 'Año, 4 dígitos');
define('AdvancedDateHelpDayOfYear', 'Día del año (1 a 366)');
define('AdvancedDateHelpQuarter', 'Trimestre');
define('AdvancedDateHelpDayOfWeek', 'Día de semana (Lun a Dom)');
define('AdvancedDateHelpWeekOfYear', 'Semana del año (1 a 53)');

define('InfoNoMessagesFound', 'No se encontraron mensajes.');
define('ErrorSMTPConnect', 'No se puede contactar al servidor SMTP. Revise la configuración del servidor SMTP.');
define('ErrorSMTPAuth', 'Usuario y/o clave incorrectos. Autenticación fallida.');
define('ReportMessageSent', 'Su mensaje ha sido enviadp.');
define('ReportMessageSaved', 'Su mensake ha sido guardado.');
define('ErrorPOP3Connect', 'No se puede contactar al servidor POP3, revise la configuración el servidor POP3.');
define('ErrorIMAP4Connect', 'No se puede conectar al servidor IMAP4, revise la configuración el servidor IMAP4.');
define('ErrorPOP3IMAP4Auth', 'Email/usuario y/o clave incorrectos. Autenticación fallida.');
define('ErrorGetMailLimit', 'Disculpas, tu casilla de correo excedido el tamaño límite.');

define('ReportSettingsUpdatedSuccessfuly', 'Configuraciones actualizadas satisfactoriamente.');
define('ReportAccountCreatedSuccessfuly', 'Cuenta creada satisfactoriamente.');
define('ReportAccountUpdatedSuccessfuly', 'Cuenta creada satisfactoriamente.');
define('ConfirmDeleteAccount', 'Está seguro de eliminar la cuenta?');
define('ReportFiltersUpdatedSuccessfuly', 'Filtros actualizados satisfactoriamente.');
define('ReportSignatureUpdatedSuccessfuly', 'Firma actualizada satisfactoriamente.');
define('ReportFoldersUpdatedSuccessfuly', 'Carpetas actualizadas satisfactoriamente.');
define('ReportContactsSettingsUpdatedSuccessfuly', 'Configuración de contactos actualizada satisfactoriamente.');

define('ErrorInvalidCSV', 'El archivo CSV seleccionado tiene un formato inválido.');
//El grupo "guies" fue agregado satisfactoriamente.
define('ReportGroupSuccessfulyAdded1', 'El grupo');
define('ReportGroupSuccessfulyAdded2', 'fue satisfactoriamente agregado.');
define('ReportGroupUpdatedSuccessfuly', 'Grupo actualizado satisfactoriamente.');
define('ReportContactSuccessfulyAdded', 'Contacto agregado satisfactoriamente.');
define('ReportContactUpdatedSuccessfuly', 'Contacto actualizado satisfactoriamente.');
//Contacto(s) agregados al grupo "amigos".
define('ReportContactAddedToGroup', 'Contacto(s) agregados al grupo');
define('AlertNoContactsGroupsSelected', 'No hay contactos o grupos seleccionados.');

define('InfoListNotContainAddress', 'Si la lista no contiene la dirección que está buscando, pruebe tipeado sus primeras letras.');

define('DirectAccess', 'D');
define('DirectAccessTitle', 'Modo Directo. WebMail accede a los mensajes directamente desde el servidor.');

define('FolderInbox', 'Bandeja de Entrada');
define('FolderSentItems', 'Elementos Enviados');
define('FolderDrafts', 'Borrador');
define('FolderTrash', 'Papelera');

define('FileLargerAttachment', 'El tamaño del archivo excede el límite máximo permitido para adjuntos.');
define('FilePartiallyUploaded', 'Solo una parte del archivo fue subida debido a un error desconocido.');
define('NoFileUploaded', 'Los archivos no fueron archivos.');
define('MissingTempFolder', 'Falta la carpeta temporal.');
define('MissingTempFile', 'Falta el archivo temporal.');
define('UnknownUploadError', 'Ocurrido un error desconocido al subir archivos.');
define('FileLargerThan', 'Error al subir archivo. Muy probablemente, el archivo es mayor a ');
define('PROC_CANT_LOAD_DB', 'No se puede contactar a la base de datos.');
define('PROC_CANT_LOAD_LANG', 'No se encuentra archivo de lenguaje requerido.');
define('PROC_CANT_LOAD_ACCT', 'La cuenta no existe, quizás, fue simplemente eliminada.');

define('DomainDosntExist', 'Dominio inexistente en el servidor de mails.');
define('ServerIsDisable', 'Usar servidor de mail está prohibido por el administrador.');

define('PROC_ACCOUNT_EXISTS', 'La cuenta no puede ser creada porque ya existe.');
define('PROC_CANT_GET_MESSAGES_COUNT', 'No se puede obtener la cantidad de mensajes de la carpeta.');
define('PROC_CANT_MAIL_SIZE', 'No se puede obtener el tamaño de almacenamiento de mails.');

define('Organization', 'Organización');
define('WarningOutServerBlank', 'No puede dejar el campo Correo Saliente en blanco');

//
define('JS_LANG_Refresh', 'Refrescar');
define('JS_LANG_MessagesInInbox', 'Mensajes(s) en Bandeja de Entrada');
define('JS_LANG_InfoEmptyInbox', 'Bandeja de Entrada vacia');

// webmail 4.2 constants
define('BackToList', 'Volver a Mails');
define('InfoNoContactsGroups', 'No Contactos ni Grupos.');
define('InfoNewContactsGroups', 'Puede crear un nuevos contactos/grupos o importar contactos de un archivo .CSV en formato MS Outlook.');
define('DefTimeFormat', 'Formato de hora predeterminado');
define('SpellNoSuggestions', 'Sin sugerencias');
define('SpellWait', 'Por favor espere&hellip;');

define('InfoNoMessageSelected', 'Sin mensajes seleccionados.');
define('InfoSingleDoubleClick', 'Usted puede hacer un click en cualquier mensaje de la lista para visualizarlo o doble click para visualizarlo en tamaño completo.	');

// calendar
define('TitleDay', 'Vista Diaria');
define('TitleWeek', 'Vista Semanal');
define('TitleMonth', 'Vista Mensual');

define('ErrorNotSupportBrowser', 'Calendario GaneTiempoYDinero no soportado por su navegador. Por favor use FireFox 2.0 or superior, Opera 9.0 o superior, Internet Explorer 6.0 or superior, Safari 3.0.2 o superior.');
define('ErrorTurnedOffActiveX', 'Soporte ActiveX deshabilitado. <br/>Debe habilitarlo para poder utilizar esta aplicación.');

define('Calendar', 'Calendario');

define('TabDay', 'Día');
define('TabWeek', 'Semana');
define('TabMonth', 'Mes');

define('ToolNewEvent', 'Nuevo&nbsp;Evento');
define('ToolBack', 'Atrás');
define('ToolToday', 'Hoy');
define('AltNewEvent', 'Nuevo Evento');
define('AltBack', 'Atrás');
define('AltToday', 'Hoy');
define('CalendarHeader', 'Calendario');
define('CalendarsManager', 'Administrar Calendarios');

define('CalendarActionNew', 'Nuevo Calendario');
define('EventHeaderNew', 'Nuevo Evento');
define('CalendarHeaderNew', 'Nuevo Calendario');

define('EventSubject', 'Asunto');
define('EventCalendar', 'Calendario');
define('EventFrom', 'Desde');
define('EventTill', 'hasta');
define('CalendarDescription', 'Descripcion');
define('CalendarColor', 'Color');
define('CalendarName', 'Nombre Calendario');
define('CalendarDefaultName', 'Mi Calendario');

define('ButtonSave', 'Guardar');
define('ButtonCancel', 'Cancelar');
define('ButtonDelete', 'Borrar');

define('AltPrevMonth', 'Mes Anterior');
define('AltNextMonth', 'Mes Siguiente');

define('CalendarHeaderEdit', 'Editar Calendario');
define('CalendarActionEdit', 'Editar Calendario');
define('ConfirmDeleteCalendar', 'Esta seguro que desea borrar el calendario');
define('InfoDeleting', 'Borrando&hellip;');
define('WarningCalendarNameBlank', 'No puede dejar el nombre de calendario en blanco.');
define('ErrorCalendarNotCreated', 'Calendario no creado.');
define('WarningSubjectBlank', 'No puede dejar el asunto en blanco.');
define('WarningIncorrectTime', 'La hora especificada contiene caracteres no válidos.');
define('WarningIncorrectFromTime', 'La hora desde es incorrecta.');
define('WarningIncorrectTillTime', 'La hora hasta es incorrecta.');
define('WarningStartEndDate', 'La fecha de fin debe ser mayor o igual a la fecha de inicio.');
define('WarningStartEndTime', 'La hora de fin debe ser mayor o igual a la hora de inicio.');
define('WarningIncorrectDate', 'La fecha debe ser correcta.');
define('InfoLoading', 'Cargando&hellip;');
define('EventCreate', 'Crear Evento');
define('CalendarHideOther', 'Ocultar otros Calendarios');
define('CalendarShowOther', 'Ver otros Calendarios');
define('CalendarRemove', 'Eliminar Calendario');
define('EventHeaderEdit', 'Editar Evento');

define('InfoSaving', 'Guardando&hellip;');
define('SettingsDisplayName', 'Mostrar Nombre');
define('SettingsTimeFormat', 'Formato Hora');
define('SettingsDateFormat', 'Formato Fecha');
define('SettingsShowWeekends', 'Mostrar semanas');
define('SettingsWorkdayStarts', 'Día laborable inicia');
define('SettingsWorkdayEnds', 'finaliza');
define('SettingsShowWorkday', 'Mostrar día laborable');
define('SettingsWeekStartsOn', 'Semana comienza el');
define('SettingsDefaultTab', 'Ficha Predeterminada');
define('SettingsCountry', 'Pais');
define('SettingsTimeZone', 'Zona Horaria');
define('SettingsAllTimeZones', 'Todas las zonas horarias');

define('WarningWorkdayStartsEnds', 'El \'Día laborable finaliza\' debe ser mayor que el \'Día laborable inicia\'');
define('ReportSettingsUpdated', 'Configuraciones actualizadas satisfactoriamente.');

define('SettingsTabCalendar', 'Calendario');

define('FullMonthJanuary', 'Enero');
define('FullMonthFebruary', 'Febrero');
define('FullMonthMarch', 'Marzo');
define('FullMonthApril', 'Abrirl');
define('FullMonthMay', 'Mayo');
define('FullMonthJune', 'Junio');
define('FullMonthJuly', 'Julio');
define('FullMonthAugust', 'Agosto');
define('FullMonthSeptember', 'Septiembre');
define('FullMonthOctober', 'Octubre');
define('FullMonthNovember', 'Noviembre');
define('FullMonthDecember', 'Diciembre');

define('ShortMonthJanuary', 'Ene');
define('ShortMonthFebruary', 'Feb');
define('ShortMonthMarch', 'Mar');
define('ShortMonthApril', 'Abr');
define('ShortMonthMay', 'May');
define('ShortMonthJune', 'Jun');
define('ShortMonthJuly', 'Jul');
define('ShortMonthAugust', 'Ago');
define('ShortMonthSeptember', 'Sep');
define('ShortMonthOctober', 'Oct');
define('ShortMonthNovember', 'Nov');
define('ShortMonthDecember', 'Dic');

define('FullDayMonday', 'Lunes');
define('FullDayTuesday', 'Martes');
define('FullDayWednesday', 'Miercoles');
define('FullDayThursday', 'Jueves');
define('FullDayFriday', 'Viernes');
define('FullDaySaturday', 'Sabado');
define('FullDaySunday', 'Domingo');

define('DayToolMonday', 'Lun');
define('DayToolTuesday', 'Mar');
define('DayToolWednesday', 'Mie');
define('DayToolThursday', 'Jue');
define('DayToolFriday', 'Vie');
define('DayToolSaturday', 'Sab');
define('DayToolSunday', 'Dom');

define('CalendarTableDayMonday', 'L');
define('CalendarTableDayTuesday', 'M');
define('CalendarTableDayWednesday', 'M');
define('CalendarTableDayThursday', 'J');
define('CalendarTableDayFriday', 'V');
define('CalendarTableDaySaturday', 'S');
define('CalendarTableDaySunday', 'D');

define('ErrorParseJSON', 'La respuesta JSON devuelta por el servidor no puede ser parseada.');

define('ErrorLoadCalendar', 'No se pudo cargar calendarios');
define('ErrorLoadEvents', 'No se pudo cargar eventos');
define('ErrorUpdateEvent', 'No se pudo guardar evento');
define('ErrorDeleteEvent', 'No se pudo eliminar evento');
define('ErrorUpdateCalendar', 'No se pudo guardar calendario');
define('ErrorDeleteCalendar', 'No se pudo eliminar calendario');
define('ErrorGeneral', 'Un error ha ocurrido en el servidor. Trate nuevamente más tarde.');

// webmail 4.3 constants
define('SharedTitleEmail', 'E-mail');
define('ShareHeaderEdit', 'Compartir y Publicar calendario');
define('ShareActionEdit', 'Compartir y Publicar calendario');
define('CalendarPublicate', 'Hacer de público acceso a este calendario');
define('CalendarPublicationLink', 'Link');
define('ShareCalendar', 'Compartir éste calendario');
define('SharePermission1', 'Puede hacer cambios y administrar compartidos');
define('SharePermission2', 'Puede hacer cambios a eventos');
define('SharePermission3', 'Puede ver todos los detalles de los eventos');
define('SharePermission4', 'Puede ver solo libre/ocupado (ocultar detalles)');
define('ButtonClose', 'Cerrar');
define('WarningEmailFieldFilling', 'Debe completar el campo e-mail primero');
define('EventHeaderView', 'Ver Evento');
define('ErrorUpdateSharing', 'No se puede guardar datos compartidos y publicaciones');
define('ErrorUpdateSharing1', 'No es posible compartir al usuario %s dado que no existe');
define('ErrorUpdateSharing2', 'Imposible compartir el calendario al usuario %s');
define('ErrorUpdateSharing3', 'Calendario ya compartido al usuario %s');
define('Title_MyCalendars', 'Mis Calendarios');
define('Title_SharedCalendars', 'Calendarios Compartidos');
define('ErrorGetPublicationHash', 'No se puede crear un link de publicación');
define('ErrorGetSharing', 'No se puede compartir');
define('CalendarPublishedTitle', 'Este calendario es publicado');
define('RefreshSharedCalendars', 'Refrescar calendarios compartidos');
define('Title_CheckSharedCalendars', 'Reload Calendars');

define('GroupMembers', 'Miembros');

define('ReportMessagePartDisplayed', 'Note que solo una parte del mensaje es visualizada.');
define('ReportViewEntireMessage', 'Para ver el mensaje entero,');
define('ReportClickHere', 'clickear aquí');
define('ErrorContactExists', 'Un contacto con ese nombre e e-mail ya existe.');

define('Attachments', 'Adjuntos');

define('InfoGroupsOfContact', 'Los grupos a los cuales pertenece el contacto son marcados con tildes.');
define('AlertNoContactsSelected', 'Sin contactos seleccionados.');
define('MailSelected', 'Enviar mail a direcciones seleccionadas');
define('CaptionSubscribed', 'Suscripto');

define('OperationSpam', 'Spam');
define('OperationNotSpam', 'No Spam');
define('FolderSpam', 'Spam');

// webmail 4.4 contacts
define('ContactMail', 'Mail contacto');
define('ContactViewAllMails', 'Ver todos los mails con este contacto');
define('ContactsMailThem', 'Enviarle un Mail');
define('DateToday', 'Hoy');
define('DateYesterday', 'Ayer');
define('MessageShowDetails', 'Ver detalles');
define('MessageHideDetails', 'Ocultar detalles');
define('MessageNoSubject', 'Sin Asunto');
// john@gmail.com a nadine@gmail.com
define('MessageForAddr', 'para');
define('SearchClear', 'Borrar Búsqueda');
// Resultados de búsqueda para "buscar texto" en bandeja de entrada:
// Resultados de búsqueda para "buscar texto" en todas las carpetas:
define('SearchResultsInFolder', 'Resultados de la búsqueda para "#s" en la carpeta #f:');
define('SearchResultsInAllFolders', 'Resultados de la búsqueda para "#s" en todas las carpetas:');
define('AutoresponderTitle', 'Autorespuesta');
define('AutoresponderEnable', 'Habilitar autorespuesta');
define('AutoresponderSubject', 'Asuento');
define('AutoresponderMessage', 'Mensaje');
define('ReportAutoresponderUpdatedSuccessfuly', 'Autorrespuesta ha sido actualizada satisfactoriamente.');
define('FolderQuarantine', 'Cuarentena');

//calendar
define('EventRepeats', 'Repeticiones');
define('NoRepeats', 'No repetir');
define('DailyRepeats', 'Diariamente');
define('WorkdayRepeats', 'Cada Semana (Lun. - Vie.)');
define('OddDayRepeats', 'Cada Lun., Mie. y Vie.');
define('EvenDayRepeats', 'Every Tues. and Thurs.');
define('WeeklyRepeats', 'Semanalmente');
define('MonthlyRepeats', 'Mensualmente');
define('YearlyRepeats', 'Anualmente');
define('RepeatsEvery', 'Repetir cada');
define('ThisInstance', 'Solo esta ocurrencia');
define('AllEvents', 'Todos los eventos en la serie');
define('AllFollowing', 'Todos los siguientes');
define('ConfirmEditRepeatEvent', 'Desea cambiar solo este evento, todos los eventos, o este y todos los futuros eventos de esta serie?');
define('RepeatEventHeaderEdit', 'Editar Evento Recurrente');
define('First', 'Primero');
define('Second', 'Segundo');
define('Third', 'Tercero');
define('Fourth', 'Cuarto');
define('Last', 'Ultimo');
define('Every', 'Cada');
define('SetRepeatEventEnd', 'Fecha fin');
define('NoEndRepeatEvent', 'Sin fecha fin');
define('EndRepeatEventAfter', 'Finalizar luego');
define('Occurrences', 'ocurrencias');
define('EndRepeatEventBy', 'Finalizar el');
define('EventCommonDataTab', 'Detalles principales');
define('EventRepeatDataTab', 'Detalles recurrentes');
define('RepeatEventNotPartOfASeries', 'Este evento ha sido cambiado y no es más parte de esta serie.');
define('UndoRepeatExclusion', 'Deshacer cambios a incluir en la serie.');

define('MonthMoreLink', '%d más...');
define('NoNewSharedCalendars', 'Sin nuevos calendarios');
define('NNewSharedCalendars', '%d nuevos calendarios encontrados');
define('OneNewSharedCalendars', '1 nuevo calendario encontrado');
define('ConfirmUndoOneRepeat', 'Desea restaurar este evento en la serie?');

define('RepeatEveryDayInfin', 'Diariamente');
define('RepeatEveryDayTimes', 'Diariamente, %TIMES% veces');
define('RepeatEveryDayUntil', 'Diariamente, hasta %UNTIL%');
define('RepeatDaysInfin', 'Cada %PERIOD% días');
define('RepeatDaysTimes', 'Cada %PERIOD% días, %TIMES% veces');
define('RepeatDaysUntil', 'Cada %PERIOD% días, hasta %UNTIL%');

define('RepeatEveryWeekWeekdaysInfin', 'Semanalmente');
define('RepeatEveryWeekWeekdaysTimes', 'Semanalmente, %TIMES% veces');
define('RepeatEveryWeekWeekdaysUntil', 'Semanalmente, hasta %UNTIL%');
define('RepeatWeeksWeekdaysInfin', 'Cada %PERIOD% semanas');
define('RepeatWeeksWeekdaysTimes', 'Cada %PERIOD% semanas, %TIMES% veces');
define('RepeatWeeksWeekdaysUntil', 'Cada %PERIOD% semanas, hasta %UNTIL%');

define('RepeatEveryWeekInfin', 'Semanalmente los %DAYS%');
define('RepeatEveryWeekTimes', 'Semanalmente los %DAYS%, %TIMES% veces');
define('RepeatEveryWeekUntil', 'Semanalmente los %DAYS%, hasta %UNTIL%');
define('RepeatWeeksInfin', 'Cada %PERIOD% semanas %DAYS%');
define('RepeatWeeksTimes', 'Cada %PERIOD% semanas %DAYS%, %TIMES% veces');
define('RepeatWeeksUntil', 'Cada %PERIOD% semanas %DAYS%, hasta %UNTIL%');

define('RepeatEveryMonthDateInfin', 'Mensualmente el día %DATE%');
define('RepeatEveryMonthDateTimes', 'Mensualmente el día %DATE%, %TIMES% veces');
define('RepeatEveryMonthDateUntil', 'Mensualmente el día %DATE%, hasta %UNTIL%');
define('RepeatMonthsDateInfin', 'Cada %PERIOD% meses el día %DATE%');
define('RepeatMonthsDateTimes', 'Cada %PERIOD% meses el día %DATE%, %TIMES% veces');
define('RepeatMonthsDateUntil', 'Cada %PERIOD% meses el día %DATE%, hasta %UNTIL%');

define('RepeatEveryMonthWDInfin', 'Mensualmente el %NUMBER% %DAY%');
define('RepeatEveryMonthWDTimes', 'Mensualmente el %NUMBER% %DAY%, %TIMES% veces');
define('RepeatEveryMonthWDUntil', 'Mensualmente el %NUMBER% %DAY%, hasta %UNTIL%');
define('RepeatMonthsWDInfin', 'Cada %PERIOD% meses el %NUMBER% %DAY%');
define('RepeatMonthsWDTimes', 'Cada %PERIOD% meses el %NUMBER% %DAY%, %TIMES% veces');
define('RepeatMonthsWDUntil', 'Cada %PERIOD% meses el %NUMBER% %DAY%, hasta %UNTIL%');

define('RepeatEveryYearDateInfin', 'Anualmente el día %DATE%');
define('RepeatEveryYearDateTimes', 'Anualmente el día %DATE%, %TIMES% veces');
define('RepeatEveryYearDateUntil', 'Anualmente el día %DATE%, hasta %UNTIL%');
define('RepeatYearsDateInfin', 'Cada %PERIOD% años el día %DATE%');
define('RepeatYearsDateTimes', 'Cada %PERIOD% años el día %DATE%, %TIMES% veces');
define('RepeatYearsDateUntil', 'Cada %PERIOD% años el día %DATE%, hasta %UNTIL%');

define('RepeatEveryYearWDInfin', 'Anualmente el %NUMBER% %DAY%');
define('RepeatEveryYearWDTimes', 'Anualmente el %NUMBER% %DAY%, %TIMES% veces');
define('RepeatEveryYearWDUntil', 'Anualmente el %NUMBER% %DAY%, hasta %UNTIL%');
define('RepeatYearsWDInfin', 'Cada %PERIOD% años el %NUMBER% %DAY%');
define('RepeatYearsWDTimes', 'Cada %PERIOD% años el %NUMBER% %DAY%, %TIMES% veces');
define('RepeatYearsWDUntil', 'Cada %PERIOD% años el %NUMBER% %DAY%, hasta %UNTIL%');

define('RepeatDescDay', 'día');
define('RepeatDescWeek', 'semana');
define('RepeatDescMonth', 'mes');
define('RepeatDescYear', 'año');

// webmail 4.5 contacts
define('WarningUntilDateBlank', 'Por favor especificar días de finalización de la repetición');
define('WarningWrongUntilDate', 'El día de finalización de la repetición debe ser posterior al día de comienzo');

define('OnDays', 'Los días');
define('CancelRecurrence', 'Cancelar repetición');
define('RepeatEvent', 'Repetir éste evento');

define('Spellcheck', 'Revisar Ortografía');
define('LoginLanguage', 'Idioma');
define('LanguageDefault', 'Predeterminado');

// webmail 4.5.x new
define('EmptySpam', 'Empty Spam');
define('Saving', 'Saving&hellip;');
define('Sending', 'Sending&hellip;');
define('LoggingOffFromServer', 'Logging off from server&hellip;');

//webmail 4.6
define('PROC_CANT_SET_MSG_AS_SPAM', 'Can\'t mark message(s) as spam');
define('PROC_CANT_SET_MSG_AS_NOTSPAM', 'Can\'t mark message(s) as non-spam');
define('ExportToICalendar', 'Export to iCalendar');
define('ErrorMaximumUsersLicenseIsExceeded', 'Your account is disabled because maximum number of users allowed by license is exceeded. Please contact your system administrator.');
define('RepliedMessageTitle', 'Replied Message');
define('ForwardedMessageTitle', 'Forwarded Message');
define('RepliedForwardedMessageTitle', 'Replied and Forwarded Message');
define('ErrorDomainExist', 'The user cannot be created because corresponding domain doesn\'t exist. You should create the domain first.');

// webmail 4.6.x or 4.7
define('RequestReadConfirmation', 'Reading confirmation');
define('FolderTypeDefault', 'Default');
define('ShowFoldersMapping', 'Let me use another folder as a system folder (e.g. use MyFolder as Sent Items)');
define('ShowFoldersMappingNote', 'For instance, to change Sent Items location from Sent Items to MyFolder, specify "Sent Items" in "Use for" dropdown of "MyFolder".');
define('FolderTypeMapTo', 'Use for');

define('ReminderEmailExplanation', 'This message has come to your account %EMAIL% because you ordered event notification in your calendar: %CALENDAR_NAME%');
define('ReminderOpenCalendar', 'Open calendar');

define('AddReminder', 'Remind me about this event');
define('AddReminderBefore', 'Remind me % before this event');
define('AddReminderAnd', 'and % before');
define('AddReminderAlso', 'and also % before');
define('AddMoreReminder', 'More reminders');
define('RemoveAllReminders', 'Remove all reminders');
define('ReminderNone', 'None');
define('ReminderMinutes', 'minutes');
define('ReminderHour', 'hour');
define('ReminderHours', 'hours');
define('ReminderDay', 'day');
define('ReminderDays', 'days');
define('ReminderWeek', 'week');
define('ReminderWeeks', 'weeks');
define('Allday', 'All day');

define('Folders', 'Folders');
define('NoSubject', 'No Subject');
define('SearchResultsFor', 'Search results for');

define('Back', 'Back');
define('Next', 'Next');
define('Prev', 'Prev');

define('MsgList', 'Messages');
define('Use24HTimeFormat', 'Use 24 hour time format');
define('UseCalendars', 'Use calendars');
define('Event', 'Event');
define('CalendarSettingsNullLine', 'No calendars');
define('CalendarEventNullLine', 'No events');
define('ChangeAccount', 'Change account');

define('TitleCalendar', 'Calendar');
define('TitleEvent', 'Event');
define('TitleFolders', 'Folders');
define('TitleConfirmation', 'Confirmation');

define('Yes', 'Yes');
define('No', 'No');

define('EditMessage', 'Edit Message');

define('AccountNewPassword', 'New password');
define('AccountConfirmNewPassword', 'Confirm new password');
define('AccountPasswordsDoNotMatch', 'Passwords do not match.');

define('ContactTitle', 'Title');
define('ContactFirstName', 'First name');
define('ContactSurName', 'Surname');
define('ContactNickName', 'Nickname');

define('CaptchaTitle', 'Captcha');
define('CaptchaReloadLink', 'reload');
define('CaptchaError', 'Captcha text is incorrect.');

define('WarningInputCorrectEmails', 'Please specify correct emails.');
define('WrongEmails', 'Incorrect emails:');

define('ConfirmBodySize1', 'Sorry, but text messages are max.');
define('ConfirmBodySize2', 'characters long. Everything beyond the limit will be truncated. Click "Cancel" if you want to edit the message.');
define('BodySizeCounter', 'Counter');
define('InsertImage', 'Insert Image');
define('ImagePath', 'Image Path');
define('ImageUpload', 'Insert');
define('WarningImageUpload', 'The file being attached is not an image. Please choose an image file.');

define('ConfirmExitFromNewMessage', 'Changes will be lost if you leave the page. Would you like to save draft before leaving the page?');

define('SensivityConfidential', 'Please treat this message as Confidential');
define('SensivityPrivate', 'Please treat this message as Private');
define('SensivityPersonal', 'Please treat this message as Personal');

define('ReturnReceiptTopText', 'The sender of this message has asked to be notified when you receive this message.');
define('ReturnReceiptTopLink', 'Click here to notify the sender.');
define('ReturnReceiptSubject', 'Return Receipt (displayed)');
define('ReturnReceiptMailText1', 'This is a Return Receipt for the mail that you sent to');
define('ReturnReceiptMailText2', 'Note: This Return Receipt only acknowledges that the message was displayed on the recipient\'s computer. There is no guarantee that the recipient has read or understood the message contents.');
define('ReturnReceiptMailText3', 'with subject');

define('SensivityMenu', 'Sensitivity');
define('SensivityNothingMenu', 'Nothing');
define('SensivityConfidentialMenu', 'Confidential');
define('SensivityPrivateMenu', 'Private');
define('SensivityPersonalMenu', 'Personal');

define('ErrorLDAPonnect', 'Can\'t connect to ldap server.');

define('MessageSizeExceedsAccountQuota', 'This message size exceeds your account quota.');
define('MessageCannotSent', 'The message cannot be sent.');
define('MessageCannotSaved', 'The message cannot be saved.');

define('ContactFieldTitle', 'Field');
define('ContactDropDownTO', 'TO');
define('ContactDropDownCC', 'CC');
define('ContactDropDownBCC', 'BCC');

// 4.9 
define('NoMoveDelete', 'Message(s) can\'t be moved to Trash. Most likely your message box is full. Should this unmoved message(s) be deleted?');

define('WarningFieldBlank', 'This field cannot be empty.');
define('WarningPassNotMatch', 'Passwords do not match, please check.');
define('PasswordResetTitle', 'Password recovery - step %d');
define('NullUserNameonReset', 'user');
define('IndexResetLink', 'Forgot password?');
define('IndexRegLink', 'Account Registration');

define('RegDomainNotExist', 'Domain does not exist.');
define('RegAnswersIncorrect', 'Answers are incorrect.');
define('RegUnknownAdress', 'Unknown email address.');
define('RegUnrecoverableAccount', 'Password recovery cannot be applied for this email address.');
define('RegAccountExist', 'This address is already used.');
define('RegRegistrationTitle', 'Registration');
define('RegName', 'Name');
define('RegEmail', 'e-mail address');
define('RegEmailDesc', 'For example, myname@domain.com. This information will be used to enter the system.');
define('RegSignMe', 'Remember me');
define('RegSignMeDesc', 'Do not ask for login and password on next login to the system on this PC.');
define('RegPass1', 'Password');
define('RegPass2', 'Repeat password ');
define('RegQuestionDesc', 'Please, provide two secret questions and answers which know only you. In case of password lost you can use these questions in order to recover the password.');
define('RegQuestion1', 'Secret question 1');
define('RegAnswer1', 'Answer 1');
define('RegQuestion2', 'Secret question 2');
define('RegAnswer2', 'Answer 2');
define('RegTimeZone', 'Time zone');
define('RegLang', 'Interface language');
define('RegCaptcha', 'Captcha');
define('RegSubmitButtonValue', 'Register');

define('ResetEmail', 'Please provide your email');
define('ResetEmailDesc', 'Provide emails address used for registration.');
define('ResetCaptcha', 'CAPTCHA');
define('ResetSubmitStep1', 'Send');
define('ResetQuestion1', 'Secret question 1');
define('ResetAnswer1', 'Answer');
define('ResetQuestion2', 'Secret question 2');
define('ResetAnswer2', 'Answer');
define('ResetSubmitStep2', 'Send');

define('ResetTopDesc1Step2', 'Providede email address');
define('ResetTopDesc2Step2', 'Please confirm correctness.');

define('ResetTopDescStep3', 'please specify below new password for your email.');

define('ResetPass1', 'New password');
define('ResetPass2', 'Repeat password');
define('ResetSubmitStep3', 'Send');
define('ResetDescStep4', 'Your password has been changed.');
define('ResetSubmitStep4', 'Return');

define('RegReturnLink', 'Return to login screen');
define('ResetReturnLink', 'Return to login screen');

// Appointments 
define('AppointmentAddGuests', 'Add guests');
define('AppointmentRemoveGuests', 'Cancel Meeting');
define('AppointmentListEmails', 'Enter email addresses separated by commas and press Save');
define('AppointmentParticipants', 'Participants');
define('AppointmentRefused', 'Refuse');
define('AppointmentAwaitingResponse', 'Awaiting response');
define('AppointmentInvalidGuestEmail', 'The following guest email addresses are invalid:');
define('AppointmentOwner', 'Owner');

define('AppointmentMsgTitleInvite', 'Invite to event.');
define('AppointmentMsgTitleUpdate', 'Event was modified.');
define('AppointmentMsgTitleCancel', 'Event was cancelled.');
define('AppointmentMsgTitleRefuse', 'Guest %guest% is refuse invitation');
define('AppointmentMoreInfo', 'More info');
define('AppointmentOrganizer', 'Organizer');
define('AppointmentEventInformation', 'Event information');
define('AppointmentEventWhen', 'When');
define('AppointmentEventParticipants', 'Participants');
define('AppointmentEventDescription', 'Description');
define('AppointmentEventWillYou', 'Will you participate');
define('AppointmentAdditionalParameters', 'Additional parameters');
define('AppointmentHaventRespond', 'Not responded yet');
define('AppointmentRespondYes', 'I will participate');
define('AppointmentRespondMaybe', 'Not sure yet');
define('AppointmentRespondNo', 'Will not participate');
define('AppointmentGuestsChangeEvent', 'Guests can change event');

define('AppointmentSubjectAddStart', 'You\'ve received invitation to event ');
define('AppointmentSubjectAddFrom', ' from ');
define('AppointmentSubjectUpdateStart', 'Modification of event ');
define('AppointmentSubjectDeleteStart', 'Cancellation of event ');
define('ErrorAppointmentChangeRespond', 'Unable to change appointment respond');
define('SettingsAutoAddInvitation', 'Add invitations into calendar automatically');
define('ReportEventSaved', 'Your event has been saved');
define('ReportAppointmentSaved', ' and notifications were send');
define('ErrorAppointmentSend', 'Can\'t send invitations.');
define('AppointmentEventName', 'Name:');

// End appointments

define('ErrorCantUpdateFilters', 'Can\'t update filters');

define('FilterPhrase', 'If there\'s %field header %condition %string then %action');
define('FiltersAdd', 'Add Filter');
define('FiltersCondEqualTo', 'equal to');
define('FiltersCondContainSubstr', 'containing substring');
define('FiltersCondNotContainSubstr', 'not containing substring');
define('FiltersActionDelete', 'delete message');
define('FiltersActionMove', 'move');
define('FiltersActionToFolder', 'to %folder folder');
define('FiltersNo', 'No filters specified yet');

define('ReminderEmailFriendly', 'reminder');
define('ReminderEventBegin', 'starts at: ');

define('FiltersLoading', 'Loading Filters...');
define('ConfirmMessagesPermanentlyDeleted', 'All messages in this folder will be permanently deleted.');

define('InfoNoNewMessages', 'There are no new messages.');
define('TitleImportContacts', 'Import Contacts');
define('TitleSelectedContacts', 'Selected Contacts');
define('TitleNewContact', 'New Contact');
define('TitleViewContact', 'View Contact');
define('TitleEditContact', 'Edit Contact');
define('TitleNewGroup', 'New Group');
define('TitleViewGroup', 'View Group');

define('AttachmentComplete', 'Complete.');

define('TestButton', 'TEST');
define('AutoCheckMailIntervalLabel', 'Autocheck mail every');
define('AutoCheckMailIntervalDisableName', 'Off');
define('ReportCalendarSaved', 'Calendar has been saved.');

define('ContactSyncError', 'Sync failed');
define('ReportContactSyncDone', 'Sync complete');

define('MobileSyncUrlTitle', 'Mobile sync URL');
define('MobileSyncLoginTitle', 'Mobile sync login');

define('QuickReply', 'Quick Reply');
define('SwitchToFullForm', 'Open full reply form');
define('SortFieldDate', 'Date');
define('SortFieldFrom', 'From');
define('SortFieldSize', 'Size');
define('SortFieldSubject', 'Subject');
define('SortFieldFlag', 'Flag');
define('SortFieldAttachments', 'Attachments');
define('SortOrderAscending', 'Ascending');
define('SortOrderDescending', 'Descending');
define('ArrangedBy', 'Arranged by');

define('MessagePaneToRight', 'The message pane is to the right of the message list, rather than below');

define('SettingsTabMobileSync', 'Mobile');

define('MobileSyncContactDataBaseTitle', 'Mobile sync contact database');
define('MobileSyncCalendarDataBaseTitle', 'Mobile sync calendar database');
define('MobileSyncTitleText', 'If you\'d like to synchronize your SyncML-enabled handheld device with WebMail, you can use these parameters.<br />"Mobile Sync URL" specifies path to SyncML Data Synchronization server, "Mobile Sync Login" is your login on SyncML Data Synchronization Server and use your own password upon request. Also, some devices need to specify database name for contact and calendar data.<br />Use "Mobile sync contact database" and "Mobile sync calendar database" respectively.');
define('MobileSyncEnableLabel', 'Enable mobile sync');

define('SearchInputText', 'search');

define('AppointmentEmailExplanation','This message has come to your account %EMAIL% because you was invited to the event by %ORGANAZER%');

define('Searching', 'Searching&hellip;');

define('ButtonSetupSpecialFolders', 'Setup special folders');
define('ButtonSaveChanges', 'Save changes');
define('InfoPreDefinedFolders', 'For pre-defined folders, use these IMAP mailboxes');

define('SaveMailInSentItems', 'Also save in Sent Items');

define('CouldNotSaveUploadedFile', 'Could not save uploaded file.');

define('AccountOldPassword', 'Current password');
define('AccountOldPasswordsDoNotMatch', 'Current Passwords do not match.');

define('DefEditor', 'Default editor');
define('DefEditorRichText', 'Rich Text');
define('DefEditorPlainText', 'Plain Text');

define('Layout', 'Layout');

define('TitleNewMessagesCount', '%count% new message(s)');

define('AltOpenInNewWindow', 'Open in new window');

define('SearchByFirstCharAll', 'All');

define('FolderNoUsageAssigned', 'No usage assigned');

define('InfoSetupSpecialFolders', 'To match a special folder (like Sent Items) and certain IMAP mailbox, click Setup special folders.');

define('FileUploaderClickToAttach', 'Click to attach a file');
define('FileUploaderOrDragNDrop', 'Or just drag and drop files here');

define('AutoCheckMailInterval1Minute', '1 minute');
define('AutoCheckMailInterval3Minutes', '3 minutes');
define('AutoCheckMailInterval5Minutes', '5 minutes');
define('AutoCheckMailIntervalMinutes', 'minutes');

define('ReadAboutCSVLink', 'Learn more on .CSV file fields');

define('VoiceMessageSubj', 'Voice Message');
define('VoiceMessageTranscription', 'Transcription');
define('VoiceMessageReceived', 'Received');
define('VoiceMessageDownload', 'Download');
define('VoiceMessageUpgradeFlashPlayer', 'You need to upgrade your Adobe Flash Player to play voice messages.<br />Upgrade to Flash Player 10 from <a href="http://www.adobe.com/go/getflashplayer/" target="_blank">Adobe</a>.');

define('LicenseKeyIsOutdated', 'This license key is outdated, please contact us to upgrade your license key');
define('LicenseProblem', 'Licensing problem. System administrator should go in Admin Panel to check the details.');

define('AccountOldPasswordNotCorrect', 'Current password is not correct');
define('AccountNewPasswordUpdateError', 'Can\'t save new password.');
define('AccountNewPasswordRejected', 'Can\'t save new password. Perhaps, it\'s too simple.');

define('CantCreateIdentity', 'Can\'t create identity');
define('CantUpdateIdentity', 'Can\'t update identity');
define('CantDeleteIdentity', 'Can\'t delete identity');

define('AddIdentity', 'Add Identity');
define('SettingsTabIdentities', 'Identities');
define('NoIdentities', 'No identities');
define('NoSignature', 'No signature');
define('Account', 'Account');
define('TabChangePassword', 'Password');
define('SignatureEnteringHere', 'Start entering your signature here');

define('CantConnectToMailServer', 'Can\'t connect to mail server');

define('DomainNameNotSpecified', 'Domain name not specified.');

define('Open', 'Open');
define('FolderUsedAs', 'used as');
define('ForwardTitle', 'Forward');
define('ForwardEnable', 'Enable forward');
define('ReportForwardUpdatedSuccessfuly', 'Forward has been updated successfully.');

define('DialogAttachHeaderResume', 'Attach Your Resume');
define('DialogAttachHeaderLetter', 'Attach Your Cover Letter');
define('DialogAttachName', 'Select Resume');
define('DialogAttachType', 'Choose Format');
define('DialogAttachTypePdf', 'Adobe PDF (.pdf)');
define('DialogAttachTypeHtml', 'Web Page (.html)');
define('DialogAttachTypeRtf', 'Rich Text (.rtf)');
define('DialogAttachTypeTxt', 'Plain Text (.txt)');
define('DialogAttachTypeDoc', 'MS Word (.doc)');
define('DialogAttachButton', 'Attach');
define('DialogAttachResume', 'Attach a resume');
define('DialogAttachLetter', 'Attach a cover letter');
define('DialogAttachAnother', 'Attach another file');
define('DialogAttachAddToBody', 'Add plain text version to email body (Recommended)');
define('DialogAttachTypeNo', 'No Attachment');
define('DialogAttachSelectLetter', 'Select cover letter');
define('DialogAttachTypePdfRecom', 'Adobe PDF (.pdf) (Recommended)');
define('DialogAttachTypeTextInBody', 'Plain text in email body - recommended');
define('DialogAttachTypeTxtAttach', 'Plain Text (.txt) attachment');
define('CustomTitle', 'Forwarding');
define('ForwardingNotificationsTo', 'Send email notifications to <b>%email</b>');
define('ForwardingForwardTo', 'Forward email to <b>%email</b>');
define('ForwardingNothing', 'No email notifications or forwarding');
define('ForwardingChange', 'change');

define('ConfirmSaveForward', 'The forward settings were not saved. Click OK to save.');
define('ConfirmSaveAutoresponder', 'The autoresponder settings were not saved. Click OK to save.');

define('DigDosMenuItem', 'DigDos');
define('DigDosTitle', 'Select an object');

define('LastLoginTitle', 'Last login');
define('ExportContacts', 'Export Contacts');
define('ProLoginBrowserWarning', 'Your current browser is outdated. It is recommended to upgrade it. You will be redirected to simplified version.');
define('LiteLoginBrowserWarning', 'Sorry, this web browser is not supported.<br/>We recommend to use one of the following browsers:<br/><a href="http://www.microsoft.com/windows/internet-explorer/default.aspx">Internet Explorer 7</a>, <a href="http://www.firefox.com/">Mozilla Firefox 2</a>, <a href="http://www.apple.com/safari/download/">Safari 2</a>, <a href="http://www.opera.com/">Opera 9</a> or newer versions of these browsers.');

define('JS_LANG_Gb', 'GB');

define('ContactsTabGlobal', 'global');
define('ContactsTabPersonal', 'personal');
define('InfoLoadingContacts', 'WebMail is loading contact list');

define('TheAccessToThisAccountIsDisabled', 'The access to this account is disabled');

define('MobileSyncDavServerURL', 'DAV server URL');
define('MobileSyncPrincipalURL', 'Principal URL');
define('MobileSyncHintDesc', 'Use these settings to sync your calendar with a mobile device which supports CalDAV protocol. With iPhone, for example, you\'ll usually need DAV server URL, mobile sync login, and your password.');

define('MobileGetIOSSettings', 'Deliver e-mail and calendar settings on your iOS device');
define('IOSLoginHeadTitle', 'Install iOS Profile');
define('IOSLoginHelloAppleTitle', 'Hello,');
define('IOSLoginHelpDesc1', 'We can automatically deliver your e-mail and calendar settings on your iOS device.');
define('IOSLoginHelpDesc2', 'You can always get them later,');
define('IOSLoginHelpDesc3', 'in Settings/Mobile section.');
define('IOSLoginButtonYesPlease', 'Yes, please');
define('IOSLoginButtonSkip', 'Skip this and let me in');
