# Generated by Django 5.1.2 on 2024-12-07 22:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0016_comment_personaevents_comments'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='personaevents',
            name='comments',
        ),
        migrations.AddField(
            model_name='organizationsevents',
            name='comments',
            field=models.ManyToManyField(to='main.comment'),
        ),
    ]