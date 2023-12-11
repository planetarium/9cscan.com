module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-run');
    grunt.loadNpmTasks('grunt-aws-s3');
    let config = {}
    try {
        config = grunt.file.readJSON('.config')
    } catch(e) {
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        run: {
            web_build: {
                cmd: 'npm',
                args: [
                    'run',
                    'build'
                ]
            },
            web_stage: {
                cmd: 'npm',
                args: [
                    'run',
                    'stage'
                ]
            },
            web_serve: {
                cmd: 'npm',
                args: [
                    'run',
                    'serve'
                ]
            },
        },
        aws: {
            AWSAccessKeyId: config.credentials.accessKeyId,
            AWSSecretKey: config.credentials.secretAccessKey
        },
        aws_s3: {
            options: {
                accessKeyId: config.credentials.accessKeyId,
                secretAccessKey: config.credentials.secretAccessKey,
                region: config.region,
                uploadConcurrency: 5,
                downloadConcurrency: 5
            },
            web: {
                options: {
                    bucket: config.s3WebBucketName,
                    differential: true
                },
                files: [
                    {action: 'upload', cwd: 'dist', src: ['**'], expand: true}
                ]
            },
            stage: {
                options: {
                    bucket: config.s3StageWebBucketName,
                    differential: true
                },
                files: [
                    {action: 'upload', cwd: 'dist', src: ['**'], expand: true}
                ]
            }
        }
    });

    grunt.registerTask('build', ['run:web_build']);
    grunt.registerTask('serve', ['run:web_serve']);
    grunt.registerTask('deploy', ['run:web_build', 'aws_s3:web']);
    grunt.registerTask('stage', ['run:web_stage', 'aws_s3:stage']);
};
