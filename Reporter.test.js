const Reporter = require('./Reporter')


Reporter.emit('error', new Error('123'))

Reporter.emit('success', 'kang', 'kang')

Reporter.emit('warn', 'warning!!!')

Reporter.emit('debug', 'debug!!')

Reporter.emit('info', 'info!!')


Reporter.info('info!!!')
Reporter.error('error!!')
Reporter.error(new Error('test'))
Reporter.warn('warning!!')
Reporter.success('success!!')